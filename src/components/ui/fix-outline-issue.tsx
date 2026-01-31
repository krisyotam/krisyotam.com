"use client";

import { useEffect } from 'react';

/**
 * This component adds CSS fixes to prevent white outline flashing
 * on bento cards during view transitions between grid and list views
 */
export default function FixOutlineIssue() {
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    
    // Add CSS rules to fix the outline issue
    style.textContent = `
      /* Fix for white outline issue on bento cards during view transitions */
      .group {
        outline: none !important;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }
      
      /* Prevent outlines on images */
      .object-cover {
        outline: none !important;
        border: none;
      }
      
      /* Fix for transitions */
      .transition-all {
        transition: transform 0.3s ease, box-shadow 0.3s ease !important;
      }
    `;
    
    // Append the style element to the document head
    document.head.appendChild(style);
    
    // Clean up the style element when the component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}
