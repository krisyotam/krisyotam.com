"use client"

import Image from "next/image";
import "./product.css";

export interface ProductProps {
  /** URL of the product image */
  image: string;
  /** Display name/title of the product */
  title: string;
  /** Description text displayed under the title */
  description: string;
  /** Link to the product (opens in new tab when clicked) */
  link: string;
}

export default function Product({ image, title, description, link }: ProductProps) {
  return (
    <main className="product-component p-6 rounded-none my-6 bg-muted/50 dark:bg-[hsl(var(--popover))] text-sm flex flex-col items-center cursor-pointer" onClick={() => window.open(link, "_blank", "noopener,noreferrer")}>
      <div className="product-link flex flex-col items-center p-4 text-center no-underline">
        <span className="product-image-container w-48 h-48 bg-center bg-cover mb-3 relative">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "contain" }}
            className="product-image"
            unoptimized={image?.includes('krisyotam.com')}
          />
        </span>
        <span className="product-title inline-block font-medium text-base">{title}</span>
        <span className="product-description text-muted-foreground text-xs mt-1">{description}</span>
      </div>
    </main>
  );
} 