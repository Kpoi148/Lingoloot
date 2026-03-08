"use client";
// Reusable typewriter effect used to animate short landing slogans.

import { useEffect, useMemo, useState } from "react";

type TypewriterTextProps = {
    phrases: string[];
    className?: string;
    typingDelayMs?: number;
    deletingDelayMs?: number;
    pauseMs?: number;
};

export default function TypewriterText({
    phrases,
    className = "",
    typingDelayMs = 60,
    deletingDelayMs = 36,
    pauseMs = 1800,
}: TypewriterTextProps) {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    const safePhrases = useMemo(
        () => phrases.filter((phrase) => phrase.trim().length > 0),
        [phrases]
    );

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const applyPreference = () => setPrefersReducedMotion(mediaQuery.matches);

        applyPreference();
        mediaQuery.addEventListener("change", applyPreference);

        return () => mediaQuery.removeEventListener("change", applyPreference);
    }, []);

    useEffect(() => {
        if (safePhrases.length === 0) {
            return;
        }

        if (prefersReducedMotion || safePhrases.length === 1) {
            setDisplayedText(safePhrases[0]);
            setPhraseIndex(0);
            setIsDeleting(false);
            return;
        }

        const currentPhrase = safePhrases[phraseIndex] ?? safePhrases[0];

        if (!isDeleting && displayedText === currentPhrase) {
            const pauseTimeout = window.setTimeout(() => {
                setIsDeleting(true);
            }, pauseMs);

            return () => window.clearTimeout(pauseTimeout);
        }

        if (isDeleting && displayedText.length === 0) {
            setIsDeleting(false);
            setPhraseIndex((currentIndex) => (currentIndex + 1) % safePhrases.length);
            return;
        }

        const nextLength = isDeleting
            ? displayedText.length - 1
            : displayedText.length + 1;

        const frameTimeout = window.setTimeout(() => {
            setDisplayedText(currentPhrase.slice(0, nextLength));
        }, isDeleting ? deletingDelayMs : typingDelayMs);

        return () => window.clearTimeout(frameTimeout);
    }, [
        deletingDelayMs,
        displayedText,
        isDeleting,
        pauseMs,
        phraseIndex,
        prefersReducedMotion,
        safePhrases,
        typingDelayMs,
    ]);

    if (safePhrases.length === 0) {
        return null;
    }

    return (
        <span
            aria-live="polite"
            className={`block min-h-[2.2em] max-w-full whitespace-normal break-words ${className}`}
        >
            <span>{displayedText}</span>
            <span
                aria-hidden="true"
                className="ml-1 inline-block h-[0.95em] w-px animate-pulse bg-current align-middle"
            />
        </span>
    );
}
