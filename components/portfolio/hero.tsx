"use client";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

export function Hero() {
  const links = ["Posts", "Projects", "CV", "About"];

  return (
    <section className="w-full">
      <div className="w-full">
        {/* Outer Bento Container */}
        <div className="w-full h-full border border-border bg-card rounded-none overflow-hidden flex flex-col">
          {/* Top Section: PFP left, Bio right */}
          <div className="flex flex-col md:flex-row w-full">
            {/* Left: Square PFP in its own Bento */}
            <div className="border-b md:border-b-0 md:border-r border-border p-4 bg-background flex items-center justify-center">
              <div className="border border-border rounded-none">
                <PixelatedCanvas
                  src="https://i.ibb.co/QFtZcvSx/krisyotam-light.png"
                  width={280}
                  height={280}
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
                  className="rounded-none"
                />
              </div>
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
              <a
                key={label}
                href={`/${label.toLowerCase()}`}
                className="flex-1 text-center px-6 py-4 text-sm font-medium hover:bg-muted/30 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

export default Hero;
