"use client";
import { useState, useEffect, useRef } from 'react';

export default function useInView({ threshold = 0.2 } = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView];
} 