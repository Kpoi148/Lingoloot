# LingoLoot 🏰💎

**LingoLoot** là ứng dụng học tiếng Anh kết hợp gamification — học từ vựng, chinh phục quiz, duy trì streak, thu thập phần thưởng và tùy biến hồ sơ cá nhân.  
Source code nằm trong thư mục `engquest-nextjs/`.

## ✨ Tính năng chính

### 📚 Học tập
- **Topics**: Duyệt và chọn chủ đề từ vựng theo cấp độ.
- **Flashcard & Practice**: Học từ vựng qua flashcard tương tác, luyện tập với quiz theo chủ đề.
- **Story Cloze**: Trò chơi điền từ vào câu chuyện do AI tạo, rèn kỹ năng đọc hiểu.
- **Dictionary**: Tra cứu từ điển tích hợp.

### 🎮 Gamification
- **XP & Levels**: Nhận XP khi hoàn thành bài học, lên cấp mở khóa tính năng mới.
- **Streak & Daily Rewards**: Duy trì chuỗi đăng nhập hàng ngày, nhận thưởng qua Streak Board 7 ngày.
- **Leaderboard**: Bảng xếp hạng cạnh tranh với bạn bè.

### 🛍️ Shop & Inventory
- **Gem Economy**: Kiếm Gem qua học tập, chi tiêu tại Shop.
- **Avatar & Frame**: Mua Avatar và Profile Frame độc quyền (Hex, Mystic, Tech styles).
- **Rarity System**: Vật phẩm phân theo độ hiếm (Common, Rare, Legendary) với hiệu ứng visual.
- **Inventory**: Quản lý và trang bị vật phẩm đã sở hữu.

### 🤖 AI Hub (Beta)
- **AI Frame Generator**: Mô tả frame mong muốn, AI (Google Gemini) sẽ tạo frame độc nhất.
- **AI Quiz Generator**: Tạo quiz tự động từ AI theo chủ đề.
- **AI Vocabulary Generator**: Sinh từ vựng tự động với AI.
- **Save to Shop**: Frame/quiz được tạo có thể lưu vào shop.

### 👤 Profile
- **Tùy chỉnh hồ sơ**: Avatar, display name, bio cá nhân.
- **Thống kê**: Theo dõi số từ vựng đã thêm, số quiz đã làm, độ chính xác.
- **Trang bị**: Equip avatar và frame đã mua từ Shop.

### 👨‍💻 Admin Portal
- **Dashboard**: Tổng quan thống kê người dùng và hệ thống.
- **User Management**: Xem, chỉnh sửa, ban/unban user.
- **Shop Management**: Tạo và quản lý vật phẩm trong shop.
- **Quiz Management**: Quản lý quiz (tiêu đề, thời gian, cấp độ, câu hỏi).
- **Category Management**: Quản lý danh mục chủ đề.
- **Vocabulary Management**: Quản lý từ vựng theo chủ đề.
- **AI Hub**: Quản lý nội dung do AI tạo (frames, games, quizzes, vocabulary).

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router), React 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) (via Mongoose) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) (Credentials provider) |
| **AI** | [Google Generative AI SDK](https://ai.google.dev/) (Gemini) |
| **Validation** | [Zod](https://zod.dev/) |
| **UI/UX** | `lucide-react`, `framer-motion`, `canvas-confetti`, `next-themes` (dark mode) |
| **Drag & Drop** | `@dnd-kit/core` |
| **Media** | Cloudinary (remote images), Sharp (image processing) |
| **Testing** | Jest, React Testing Library |

## 📁 Cấu trúc thư mục

```
engquest-nextjs/
├── src/
│   ├── actions/         # Server Actions (admin & user)
│   ├── app/
│   │   ├── (app)/       # App routes (admin, learn, shop, profile, topics)
│   │   ├── api/         # API routes (auth, ai, games, quizzes, progress...)
│   │   └── page.tsx     # Landing page
│   ├── components/      # React components (admin, auth, game, shop, landing...)
│   ├── lib/             # Utilities, auth, DB, gamification logic, validations
│   ├── models/          # Mongoose models (User, Quiz, Category, Vocabulary...)
│   ├── scripts/         # Helper scripts
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
├── tailwind.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18
- **MongoDB** instance (local hoặc Atlas)
- **Google AI API Key** (cho tính năng AI Hub)

### Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd LingoLoot/engquest-nextjs

# Cài dependencies
npm install

# Tạo file .env.local với các biến:
# MONGODB_URI=<your-mongodb-uri>
# NEXTAUTH_SECRET=<your-secret>
# NEXTAUTH_URL=http://localhost:3000
# GEMINI_API_KEY=<your-google-ai-key>

# Chạy dev server
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### Scripts

| Lệnh | Mô tả |
|-------|-------|
| `npm run dev` | Chạy dev server |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra lint |
| `npm test` | Chạy unit tests |
| `npm run test:watch` | Chạy tests ở watch mode |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

Copyright © 2026 LingoLoot. All rights reserved.
