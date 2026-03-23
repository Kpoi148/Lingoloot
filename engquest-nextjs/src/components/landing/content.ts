// Shared copy and navigation data for the public learner landing page.

export const landingNavItems = [
  { label: "Sản phẩm", id: "product" },
  { label: "Lộ trình", id: "flow" },
  { label: "Phần thưởng", id: "rewards" },
] as const;

export const landingActions = {
  primary: { label: "Tạo tài khoản miễn phí", id: "register" as const },
  secondary: { label: "Đăng nhập", id: "login" as const },
  tertiary: { label: "Xem cách hoạt động", id: "flow" as const },
};

export const landingQuickAccessBullets = [
  "Tiếp tục đúng topic đang học.",
  "Giữ lại streak, XP và rewards.",
] as const;

export const landingHeroHighlights = [
  { label: "Nhịp học", value: "10-15 phút" },
  { label: "Flow", value: "1 topic, 3 bước luyện" },
  { label: "Rewards", value: "XP, Gems, profile items" },
] as const;

export const landingFlowSteps = [
  {
    step: "01",
    title: "Chọn topic",
    description:
      "Vào đúng bộ từ bạn muốn tập trung ngay lúc này.",
  },
  {
    step: "02",
    title: "Lật flashcards",
    description:
      "Nắm nghĩa, phát âm và ví dụ trong một lượt ngắn.",
  },
  {
    step: "03",
    title: "Làm quiz ngắn",
    description:
      "Kiểm tra lại trên chính bộ từ vừa học.",
  },
  {
    step: "04",
    title: "Chốt bằng Story Cloze",
    description:
      "Khóa lại ngữ cảnh trước khi progress được lưu.",
  },
] as const;
