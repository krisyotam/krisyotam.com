"use client";

import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans overflow-hidden"
      ref={containerRef}
    >
      <div ref={ref} className="relative w-full pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-row items-start gap-6 py-12"
          >
            {/* Left side: dot + year */}
            <div className="relative w-32 flex flex-col items-start pl-4">
              <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-600 z-10" />
              <h3 className="mt-6 text-2xl font-bold text-neutral-500 dark:text-neutral-400 pl-4">
                {item.title}
              </h3>
            </div>

            {/* Right side: content */}
            <div className="flex-1">{item.content}</div>
          </div>
        ))}

        {/* Vertical stick */}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-2 top-0 w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent via-neutral-200 dark:via-neutral-700 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-black/80 to-transparent dark:from-white/80 dark:to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
