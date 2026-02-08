"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Gift, Sparkles, Star } from "lucide-react";
import {
  checkDailyLogin,
  type DailyLoginReward,
} from "@/actions/user/gamification.actions";
import { getLevelTitle } from "@/lib/gamification";

type RewardState = DailyLoginReward & {
  levelUp: boolean;
  newLevel: number;
};

const CoinAnimation = () => (
  <motion.div
    className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 shadow-lg shadow-amber-200/60"
    animate={{ y: [0, -6, 0], rotate: [0, 8, -8, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <Star className="h-10 w-10 text-white" />
    <motion.div
      className="absolute -right-2 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-amber-500 shadow"
      animate={{ scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 1.6, repeat: Infinity }}
    >
      <Sparkles className="h-4 w-4" />
    </motion.div>
  </motion.div>
);

const ChestAnimation = () => (
  <div className="relative h-28 w-36">
    <motion.div
      className="absolute left-1/2 top-2 h-12 w-32 -translate-x-1/2 rounded-t-2xl border-2 border-amber-700 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 shadow-md"
      style={{ transformOrigin: "bottom center" }}
      initial={{ rotateX: 0 }}
      animate={{ rotateX: -35 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
    />
    <div className="absolute bottom-0 left-1/2 h-20 w-32 -translate-x-1/2 rounded-2xl border-2 border-amber-800 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 shadow-lg" />
    <div className="absolute bottom-6 left-1/2 h-6 w-10 -translate-x-1/2 rounded-md border-2 border-amber-900 bg-amber-200 shadow-inner" />
    <motion.div
      className="absolute -right-2 -top-4 rounded-full bg-white p-2 text-amber-500 shadow"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.4, repeat: Infinity }}
    >
      <Gift className="h-4 w-4" />
    </motion.div>
  </div>
);

export default function DailyRewardModal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reward, setReward] = useState<RewardState | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setCheckedUserId(null);
      return;
    }

    const userId = session?.user?.id;
    if (!userId || checkedUserId === userId) {
      return;
    }

    setCheckedUserId(userId);

    checkDailyLogin(userId)
      .then((result) => {
        if (result.status === "claimed") {
          setReward({
            ...result.reward,
            levelUp: result.levelUp,
            newLevel: result.newLevel,
          });
          setIsOpen(true);
        }
      })
      .catch(() => {
        // Ignore reward failures to avoid blocking UI.
      });
  }, [checkedUserId, session?.user?.id, status]);

  useEffect(() => {
    if (!showLevelUp) return;
    if (typeof window !== "undefined") {
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    }
    const timer = setTimeout(() => setShowLevelUp(false), 2400);
    return () => clearTimeout(timer);
  }, [showLevelUp]);

  const handleClaim = () => {
    setIsOpen(false);
    if (reward?.levelUp) {
      setShowLevelUp(true);
    }
    router.refresh();
  };

  const levelTitle = useMemo(
    () => (reward ? getLevelTitle(reward.newLevel) : ""),
    [reward]
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && reward && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Daily Check-in
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {reward.weeklyBonus ? "Big Chest Unlocked!" : "Daily Reward"}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Streak: {reward.streak} day{reward.streak === 1 ? "" : "s"}
              </p>

              <div className="mt-6 flex justify-center">
                {reward.weeklyBonus ? <ChestAnimation /> : <CoinAnimation />}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  +{reward.xp} XP
                </span>
                {reward.gems > 0 && (
                  <span className="ml-2 text-amber-600">
                    +{reward.gems} LingoGems
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleClaim}
                className="mt-6 w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Claim {reward.xp} XP
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLevelUp && reward && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-amber-50/90 via-white/90 to-rose-50/90 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rounded-3xl border border-amber-200 bg-white/90 px-8 py-6 text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
                Level Up
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-slate-900">
                Lv. {reward.newLevel} {levelTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Keep the streak going!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
