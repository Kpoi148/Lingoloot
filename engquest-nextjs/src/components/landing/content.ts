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
  "Bắt đầu learner workspace trong một bước.",
  "Tiếp tục streak, XP và tiến độ đang có.",
  "Vào lại đúng flow học thay vì mở từ đầu.",
] as const;

export const landingHeroPillars = [
  {
    eyebrow: "Study loop",
    title: "Đi từ topic sang luyện tập mà không bị đứt mạch",
    description:
      "Một bộ từ được tái sử dụng xuyên suốt thay vì tách thành nhiều bề mặt rời rạc.",
  },
  {
    eyebrow: "Context recall",
    title: "Story Cloze giữ phần luyện nhớ không dừng ở flashcard",
    description:
      "Từ được kéo vào ngữ cảnh để chuyển từ nhận diện sang ghi nhớ chủ động.",
  },
  {
    eyebrow: "Visible momentum",
    title: "Streak, XP và profile rewards làm tiến bộ trở nên nhìn thấy được",
    description:
      "Mỗi phiên học để lại dấu vết rõ ràng thay vì cảm giác học xong rồi biến mất.",
  },
] as const;

export const landingHeroHighlights = [
  { label: "Nhịp học", value: "10-15 phút mỗi lượt" },
  { label: "Progress", value: "Lưu theo topic đang học" },
  { label: "Rewards", value: "XP, Gems, profile items" },
] as const;

export const landingFlowSteps = [
  {
    step: "01",
    title: "Chọn topic phù hợp với mục tiêu hiện tại",
    description:
      "Bắt đầu từ một bộ từ có chủ đích thay vì nhảy thẳng vào danh sách rời rạc.",
  },
  {
    step: "02",
    title: "Lật flashcards để tạo nền nhớ ban đầu",
    description:
      "Nghĩa, phát âm và ví dụ xuất hiện trong cùng một nhịp học ngắn gọn.",
  },
  {
    step: "03",
    title: "Kiểm tra lại bằng quiz ngắn trên chính bộ từ đó",
    description:
      "Recall được kiểm chứng ngay trước khi kiến thức còn kịp trôi đi.",
  },
  {
    step: "04",
    title: "Khóa phiên học bằng Story Cloze và lưu lại progress",
    description:
      "Từ vựng được gắn vào ngữ cảnh trước khi bạn rời khỏi phiên học.",
  },
] as const;
