import React from "react";
import * as Typography from "@/components/typography";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const typographyChildren: React.ReactNode[] = [];
  const otherChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (Object.values(Typography).includes(child.type as any)) {
        typographyChildren.push(child);
      } else {
        otherChildren.push(child);
      }
    } else {
      typographyChildren.push(child);
    }
  });

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {typographyChildren.length > 0 && (
        <div className="prose mx-auto px-4">
          {typographyChildren}
        </div>
      )}
      {otherChildren.length > 0 && (
        <div className="w-full">
          {otherChildren}
        </div>
      )}
    </div>
  );
}