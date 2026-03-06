/** @jest-environment node */

import { buyItem } from "./shop.actions";
import { getSession } from "@/lib/auth/auth-utils";
import { connectToDatabase } from "@/lib/db/mongodb";
import ShopItem from "@/models/ShopItem";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/auth/auth-utils", () => ({
  getSession: jest.fn(),
}));

jest.mock("@/lib/db/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/models/ShopItem", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

jest.mock("@/models/User", () => ({
  __esModule: true,
  default: {
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
  },
}));

const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockedConnectToDatabase =
  connectToDatabase as jest.MockedFunction<typeof connectToDatabase>;
const mockedRevalidatePath =
  revalidatePath as jest.MockedFunction<typeof revalidatePath>;

const mockedShopItem = ShopItem as unknown as {
  findOne: jest.Mock;
};

const mockedUser = User as unknown as {
  findOneAndUpdate: jest.Mock;
  findById: jest.Mock;
};

const USER_ID = "507f1f77bcf86cd799439011";
const ITEM_ID = "507f191e810c19729de860ea";

const mockSelectLean = <T>(value: T) => ({
  select: jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue(value),
  }),
});

const mockLean = <T>(value: T) => ({
  lean: jest.fn().mockResolvedValue(value),
});

describe("buyItem", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedGetSession.mockResolvedValue({ user: { id: USER_ID } } as never);
    mockedConnectToDatabase.mockResolvedValue({} as never);
  });

  it("returns error when user is not authenticated", async () => {
    mockedGetSession.mockResolvedValue(null as never);

    const result = await buyItem(ITEM_ID);

    expect(result).toEqual({
      success: false,
      message: "Bạn cần đăng nhập để mua hàng.",
    });
    expect(mockedConnectToDatabase).not.toHaveBeenCalled();
  });

  it("returns error when item is inactive or missing", async () => {
    mockedShopItem.findOne.mockReturnValue(mockSelectLean(null));

    const result = await buyItem(ITEM_ID);

    expect(result).toEqual({
      success: false,
      message: "Vật phẩm không tồn tại hoặc đã ngừng bán.",
    });
  });

  it("updates currency and inventory atomically when purchase succeeds", async () => {
    mockedShopItem.findOne.mockReturnValue(
      mockSelectLean({ name: "Golden Hex", price: 150 })
    );
    mockedUser.findOneAndUpdate.mockReturnValue(
      mockLean({ gamification: { currency: 350 } })
    );

    const result = await buyItem(ITEM_ID);

    expect(mockedUser.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: USER_ID,
        "gamification.currency": { $gte: 150 },
        "gamification.inventory": { $ne: ITEM_ID },
      },
      {
        $inc: { "gamification.currency": -150 },
        $addToSet: { "gamification.inventory": ITEM_ID },
      },
      {
        new: true,
        projection: { "gamification.currency": 1 },
      }
    );
    expect(result).toEqual({
      success: true,
      newBalance: 350,
      message: "Đã mua Golden Hex thành công!",
    });
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/shop");
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/profile");
  });

  it("returns already-owned message when conditional update fails due to ownership", async () => {
    mockedShopItem.findOne.mockReturnValue(
      mockSelectLean({ name: "Golden Hex", price: 150 })
    );
    mockedUser.findOneAndUpdate.mockReturnValue(mockLean(null));
    mockedUser.findById.mockReturnValue(
      mockSelectLean({
        gamification: { currency: 350, inventory: [ITEM_ID] },
      })
    );

    const result = await buyItem(ITEM_ID);

    expect(result).toEqual({
      success: false,
      message: "Bạn đã sở hữu vật phẩm này.",
    });
  });

  it("returns insufficient-funds message when conditional update fails due to low balance", async () => {
    mockedShopItem.findOne.mockReturnValue(
      mockSelectLean({ name: "Golden Hex", price: 150 })
    );
    mockedUser.findOneAndUpdate.mockReturnValue(mockLean(null));
    mockedUser.findById.mockReturnValue(
      mockSelectLean({
        gamification: { currency: 100, inventory: [] },
      })
    );

    const result = await buyItem(ITEM_ID);

    expect(result).toEqual({
      success: false,
      message: "Bạn không đủ LingoGems.",
    });
  });
});
