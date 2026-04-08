"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <div className={cn(isCenter ? "text-center" : "text-left", "break-keep", className)}>
      {eyebrow ? (
        <p className="font-eng text-[12px] font-bold tracking-[0.26em] text-[#cfb27f]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-3 whitespace-pre-line font-serif text-[clamp(28px,3.6vw,52px)] font-semibold leading-[1.22] tracking-[-0.04em] text-[#f3efe7]",
          isCenter ? "mx-auto" : "",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-[70ch] text-[15px] font-medium leading-[1.82] tracking-[-0.01em] text-[#cbc7bf]",
            isCenter ? "mx-auto" : "",
          )}
        >
          {description}
        </p>
      ) : null}
      <div className={cn("mt-5 h-px w-12 bg-[#92774b]/60 md:mt-7", isCenter ? "mx-auto" : "")} />
    </div>
  );
}
