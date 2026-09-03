// Shared copy and navigation data for the public learner landing page.

export const landingNavItems = [
  { label: "Chơi thử", id: "interactive-demo" },
  { label: "Lộ trình", id: "journey" },
  { label: "Kho báu Loot", id: "vault" },
  { label: "Chuỗi Streak", id: "streak" },
] as const;

export const landingActions = {
  primary: { label: "Bắt đầu chuyến đi", id: "register" as const },
  secondary: { label: "Đăng nhập", id: "login" as const },
  tertiary: { label: "Trải nghiệm thử", id: "interactive-demo" as const },
};

export const landingQuickAccessBullets = [
  "Khôi phục đúng tiến độ bài học dang dở.",
  "Bảo toàn chuỗi ngày học và kho báu Gems.",
] as const;

export const landingHeroHighlights = [
  { label: "Nhịp độ học", value: "10-15 phút / ngày" },
  { label: "Công thức nhớ sâu", value: "Flashcard + Story Cloze" },
  { label: "Phần thưởng", value: "Khung Avatar SVG & Gems" },
] as const;

export const landingFlowSteps = [
  {
    step: "01",
    title: "Chọn Chủ Đề Khởi Hành",
    description:
      "Tập trung đúng nhánh từ vựng bạn cần: Du lịch, Công nghệ, Đời sống hay Học thuật chuyên sâu.",
  },
  {
    step: "02",
    title: "Đúc Kết Từ Vựng 3D",
    description:
      "Nắm trọn phát âm IPA bản xứ, ngữ nghĩa tinh gọn và ví dụ bối cảnh qua thẻ Flashcard tương tác.",
  },
  {
    step: "03",
    title: "Đấu Trí Phản Xạ Quiz",
    description:
      "Thử thách tốc độ nhận diện từ vựng dưới áp lực đồng hồ đếm ngược với đáp án minh bạch.",
  },
  {
    step: "04",
    title: "Khóa Ngữ Cảnh Story Cloze",
    description:
      "Kéo thả từ vựng vào câu chuyện AI đục lỗ để khắc sâu phản xạ đọc hiểu vào trí nhớ dài hạn.",
  },
] as const;

