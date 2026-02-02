# LingoLoot 🏰💎

**LingoLoot** is an engaging English learning application that combines education with gamification. Master new vocabulary, earn XP, maintain streaks, and collect exclusive NFT-style rewards to customize your profile!

![LingoLoot Banner](/public/hero-banner.png) *(Note: Add a hero banner if available)*

## ✨ Key Features

### 🎮 Gamification
- **XP & Levels**: Earn XP for every lesson completed and level up to unlock new features.
- **Streak System**: Build daily habits and earn bonus rewards for consistency.
- **Leaderboard**: Compete with friends and other learners for the top spot.

### 🛍️ Shop & Inventory
- **Gem Economy**: Earn Gems by learning and spend them in the Shop.
- **Avatar Customization**: Buy unique Avatars and Profile Frames.
- **Rarity System**: Items come in different rarities (Common, Rare, Legendary) with visual effects.

### 🤖 AI Hub (Beta)
- **AI Frame Generator**: Unleash your creativity! Describe your dream frame, and our AI (powered by Google Gemini) will generate a unique, one-of-a-kind frame for you.
- **Save to Shop**: Successfully generated frames can be saved to the shop as personal anomalies.

### 👨‍💻 Admin Portal
- **Dashboard**: Overview of user statistics and system health.
- **Item Management**: Create and manage shop items.
- **User Management**: View and edit user profiles.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **AI**: [Google Generative AI SDK](https://ai.google.dev/)
- **State/Effects**: `framer-motion`, `zustand`, `confetti`.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Database string

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/lingoloot.git
    cd lingoloot/engquest-nextjs
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000
    GOOGLE_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
