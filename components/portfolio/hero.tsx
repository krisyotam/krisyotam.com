"use client";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface HeroProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Hero({ activeTab, onTabChange }: HeroProps) {
  const links = ["Posts", "Projects", "CV", "About"];

  return (
    <section className="w-full">
      {/* Back button */}
      <Link
        href="/"
        data-no-preview="true"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Return to Home
      </Link>
      
      <div className="w-full">
        {/* Outer Bento Container */}
        <div className="w-full h-full border border-border bg-card rounded-none overflow-hidden flex flex-col">
          {/* Top Section: PFP left, Bio right */}
          <div className="flex flex-col md:flex-row w-full">
            {/* Left: Square PFP in its own Bento */}
            <div className="border-b md:border-b-0 md:border-r border-border bg-background flex items-center justify-center">
              <PixelatedCanvas
                src="https://i.ibb.co/QFtZcvSx/krisyotam-light.png"
                width={320}
                height={320}
                cellSize={4}
                dotScale={0.95}
                shape="square"
                backgroundColor="#000000"
                dropoutStrength={0.25}
                interactive
                distortionStrength={0.6}
                distortionRadius={120}
                distortionMode="swirl"
                followSpeed={0.18}
                jitterStrength={2}
                jitterSpeed={2}
                sampleAverage
                tintColor="#FFFFFF"
                tintStrength={0.1}
                className="rounded-none w-full h-full"
              />
            </div>

            {/* Right: Bio */}
            <div className="flex-1 flex items-center p-6 md:p-10 border-t md:border-t-0 border-border">
              <ul className="text-sm md:text-base text-muted-foreground leading-snug list-disc list-inside space-y-1">
                <li>Technical Writer</li>
                <li>Designer & Systems Thinker</li>
                <li>Software Architect & Engineer</li>
              </ul>
            </div>
          </div>

          {/* Middle Section: Name and Quote */}
          <div className="border-t border-border px-6 md:px-8 pt-6 pb-8 text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Kris Yotam
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground italic max-w-2xl mx-auto leading-snug">
              "The people who are crazy enough to think they can change the world are the ones who do."
            </p>
            <p className="text-xs md:text-sm text-muted-foreground italic max-w-2xl mx-auto text-right pr-2">
              — Steve Jobs
            </p>
          </div>

          {/* Bottom Strip: Navigation Buttons */}
          <nav className="flex border-t border-border divide-x divide-border w-full">
            {links.map((label) => (
              <button
                key={label}
                onClick={() => onTabChange(label.toLowerCase())}
                className={`flex-1 text-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === label.toLowerCase() 
                    ? 'bg-muted/50 text-foreground' 
                    : 'hover:bg-muted/30 text-muted-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

export default Hero;
