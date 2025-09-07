"use client";

import React from "react";
import quotesData from "@/data/header-quotes.json";
import { cn } from "@/lib/utils";

// Fallback quotes if none valid
const fallbackQuotes = [
	{ text: "The only way to do great work is to love what you do.", author: "Steve Jobs", source: "Stanford Commencement" },
	{ text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", source: "" },
	{ text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", source: "Speech" },
	{ text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", source: "Interview" },
	{ text: "May you live in interesting times.", author: "Chinese Proverb", source: "" },
	{ text: "If you can't stand the heat, get out of the kitchen.", author: "Harry S. Truman", source: "" },
];

// Only accept quotes with both text and author, and not too long
function getValidQuotes() {
	return (quotesData.quotes || []).filter(
		(q) => q.text && q.author && q.text.length <= 180
	);
}

const inlineScrollStyles = `
  @keyframes scroll {
    to {
      transform: translate(calc(-50% - 0.5rem));
    }
  }
  .animate-scroll {
    animation: scroll 2000s linear infinite;
  }
`;

export const InfiniteMovingQuotes = ({
	direction = "left",
	pauseOnHover = true,
	className,
}: {
	direction?: "left" | "right";
	pauseOnHover?: boolean;
	className?: string;
}) => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const scrollerRef = React.useRef<HTMLUListElement>(null);
	const [start, setStart] = React.useState(false);

	React.useEffect(() => {
		addAnimation();
	}, []);

	function addAnimation() {
		if (containerRef.current && scrollerRef.current) {
			const scrollerContent = Array.from(scrollerRef.current.children);
			scrollerContent.forEach((item) => {
				const duplicatedItem = item.cloneNode(true);
				scrollerRef.current?.appendChild(duplicatedItem);
			});
			getDirection();
			setStart(true);
		}
	}

	const getDirection = () => {
		if (containerRef.current) {
			containerRef.current.style.setProperty("--animation-direction", direction === "left" ? "forwards" : "reverse");
		}
	};

	const validQuotes = getValidQuotes();
	const items = validQuotes.length > 0 ? validQuotes : fallbackQuotes;

	return (
		<div
			ref={containerRef}
			className={cn(
				"scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
				className
			)}
		>
			<style>{inlineScrollStyles}</style>
			<ul
				ref={scrollerRef}
				className={cn(
					"flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
					start && "animate-scroll",
					pauseOnHover && "hover:[animation-play-state:paused]"
				)}
			>
				{items.map((item) => (
					<li
						className="relative w-[350px] md:w-[450px] max-w-full shrink-0 h-[110px] md:h-[130px] overflow-hidden rounded-none border border-border bg-card text-card-foreground px-8 py-6"
						key={item.text + item.author + (item.source || "")}
					>
						<blockquote>
							<div
								aria-hidden="true"
								className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
							></div>
							<span className="relative z-20 text-sm leading-[1.6] font-normal text-foreground dark:text-foreground">
								{item.text}
							</span>
							<div className="relative z-20 mt-6 flex flex-row items-center">
								<span className="flex flex-col gap-1">
									<span className="text-sm leading-[1.6] font-normal text-muted-foreground dark:text-muted-foreground">
										{item.author}
									</span>
									{item.source && (
										<span className="text-sm leading-[1.6] font-normal text-muted-foreground dark:text-muted-foreground">
											{item.source}
										</span>
									)}
								</span>
							</div>
						</blockquote>
					</li>
				))}
			</ul>
		</div>
	);
};
