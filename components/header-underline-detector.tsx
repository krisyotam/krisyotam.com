"use client"

import { useEffect } from 'react'

export function HeaderUnderlineDetector() {
  useEffect(() => {
    // Function to detect percentage in headers and set underline width
    const detectPercentageInHeaders = () => {
      // Select all h1, h2, h3 elements within content areas
      const headers = document.querySelectorAll(
        '[class*="-content"] h1, [class*="-content"] h2, [class*="-content"] h3'
      )
      
      headers.forEach((header) => {
        if (!(header instanceof HTMLElement)) return;
        // Always use the original text for detection
        let originalText = header.getAttribute('data-original-header-text') || header.textContent || '';

        // Regex to match pattern like "# (50%) Text" or "## (25%) Title"
        const percentageMatch = originalText.match(/^\s*\((\d+)%\)\s*(.*)/);

        if (percentageMatch) {
          const percentage = parseInt(percentageMatch[1], 10);
          const cleanText = percentageMatch[2]; // Text without the (XX%) part

          // Set CSS custom property for the underline width
          header.style.setProperty('--underline-width', `${percentage}%`);
          header.setAttribute('data-underline-width', percentage.toString());
          header.setAttribute('data-original-header-text', originalText);
          // Update the header text to hide the percentage part
          if (header.textContent !== cleanText) header.textContent = cleanText;
        } else {
          // Remove custom property and attribute if no percentage found
          header.style.removeProperty('--underline-width');
          header.removeAttribute('data-underline-width');
          // Restore original text if it was previously changed
          if (header.hasAttribute('data-original-header-text')) {
            header.textContent = header.getAttribute('data-original-header-text') || header.textContent;
            header.removeAttribute('data-original-header-text');
          }
        }
      });
    }

    // Run detection when component mounts
    detectPercentageInHeaders()

    // Re-run detection when content changes (for dynamic content)
    const observer = new MutationObserver(() => {
      detectPercentageInHeaders()
    })

    // Observe changes to the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })

    // Cleanup observer on unmount
    return () => {
      observer.disconnect()
    }
  }, [])

  return null // This component doesn't render anything
}
