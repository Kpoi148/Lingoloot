"use client";
// Shared section wrapper that adds reveal-on-scroll animation behavior.

import { useEffect, useRef, useState } from "react";

// Lightweight hook to replace Framer Motion's whileInView
export function useInView(threshold = 0.2) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect(); // Only trigger once
                }
            },
            { threshold }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isInView };
}

// Animated section wrapper using CSS instead of Framer Motion
export function AnimatedSection({
    children,
    className = "",
    delay = 0,
    id,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    id?: string;
}) {
    const { ref, isInView } = useInView(0.2);

    return (
        <div
            ref={ref}
            id={id}
            className={`transition-all duration-700 ease-out ${className}`}
            style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}
