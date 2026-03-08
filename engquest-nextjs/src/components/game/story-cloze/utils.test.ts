import {
  getStoryClozeGaps,
  getWrongGapIds,
  splitIntoTokens,
} from "@/components/game/story-cloze/utils";

describe("story-cloze utils", () => {
  it("splits words and punctuation into separate tokens", () => {
    expect(splitIntoTokens("Hello, world!")).toEqual([
      { value: "Hello", isWord: true },
      { value: ", ", isWord: false },
      { value: "world", isWord: true },
      { value: "!", isWord: false },
    ]);
  });

  it("extracts gap metadata from mixed content", () => {
    expect(
      getStoryClozeGaps([
        { type: "text", text: "Alpha" },
        { type: "gap", text: "", answer: "beta" },
        { type: "gap", text: "gamma" },
      ])
    ).toEqual([
      { id: "gap-1", answer: "beta" },
      { id: "gap-2", answer: "gamma" },
    ]);
  });

  it("marks missing and incorrect answers as wrong gaps", () => {
    const gaps = [
      { id: "gap-0", answer: "cat" },
      { id: "gap-1", answer: "dog" },
      { id: "gap-2", answer: "bird" },
    ];
    const filledItems = new Map([
      ["a", { id: "a", word: "cat" }],
      ["b", { id: "b", word: "wolf" }],
    ]);

    expect(
      getWrongGapIds(
        gaps,
        {
          "gap-0": "a",
          "gap-1": "b",
        },
        filledItems
      )
    ).toEqual(["gap-1", "gap-2"]);
  });
});
