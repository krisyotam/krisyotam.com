"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LibersContentWarningProps {
  onAccept: () => void;
}

export function LibersContentWarning({ onAccept }: LibersContentWarningProps) {
  const router = useRouter();

  const handleAccept = () => {
    // Set localStorage to remember acceptance
    localStorage.setItem("libers-terms-accepted", "true");
    onAccept();
  };

  const handleGoHome = () => {
    router.push("/");
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800/50 max-w-2xl w-full p-8 space-y-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-red-900 dark:text-red-300">
            Content Warning
          </h2>
            <div className="space-y-4 text-sm leading-relaxed text-red-900 dark:text-red-300">
            <p>
              The Libers section contains academic research and historical documentation of 
              graphic, disturbing, and taboo subjects that have shaped human history and continue 
              to impact society today. This content is intended for educational and research 
              purposes only.
            </p>
            
            <p>
              <strong>Content may include:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Detailed discussions of violence, torture, and historical atrocities</li>
              <li>Academic analysis of sexual practices and taboo behaviors across cultures</li>
              <li>Historical documentation of discriminatory practices and social persecution</li>
              <li>Diagrams, illustrations, or artistic depictions that may include nudity</li>
              <li>Visual examples of historical torture devices, medical procedures, or archaeological findings</li>
              <li>Disturbing themes related to death, violence, and human suffering</li>
            </ul>
            
            <p>
              While no pornographic material is included, some content contains frank discussions 
              of sexuality, violence, and human anatomy in historical and academic contexts. 
              Images may include artistic nudity, medical diagrams, archaeological artifacts, 
              or historical documentation.
            </p>
            
            <p className="font-semibold">
              This content is intended for mature audiences (18+) with academic or research 
              interests in these subjects. Viewer discretion is strongly advised.
            </p>
          </div>
        </div>        <div className="space-y-4">
          <div className="bg-red-100 border border-red-200 dark:bg-red-900/20 dark:border-red-800/40 p-4 shadow-sm">
            <p className="text-sm font-medium mb-2 text-red-900 dark:text-red-300">By clicking "Accept Terms", you confirm that:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-red-900 dark:text-red-300">
              <li>You are 18 years of age or older</li>
              <li>You understand the mature nature of this content</li>
              <li>You are accessing this material for educational or research purposes</li>
              <li>You accept full responsibility for viewing this content</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              className="px-8"
            >
              Go Back Home
            </Button>
            <Button 
              onClick={handleAccept}
              className="px-8 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
            >
              Accept Terms (18+)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
