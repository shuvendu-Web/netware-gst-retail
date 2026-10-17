import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const Component: React.FC<GridBackgroundProps> = ({ children, className }) => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("min-h-full w-full relative", className)}>
      {/* Magenta Orb Grid Background (Light Mode) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none dark:hidden"
        style={{
          backgroundAttachment: "fixed",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      {/* Magenta Orb Grid Background (Dark Mode) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none hidden dark:block"
        style={{
          backgroundAttachment: "fixed",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.18) 0%, rgba(168,85,247,0.08) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export const GridBackground = Component;
export default Component;
