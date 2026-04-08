"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  const mod = index % length;
  return mod < 0 ? mod + length : mod;
}

export default function FnbNewProjectGallery({
  images,
  projectName,
  children,
  onThumbnailSelect,
}: {
  images: string[];
  projectName: string;
  children?: ReactNode;
  onThumbnailSelect?: () => void;
}) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRootRef = useRef<HTMLDivElement | null>(null);
  const thumbRowRef = useRef<HTMLDivElement | null>(null);

  const hasImages = safeImages.length > 0;
  const activeSrc = hasImages ? safeImages[clampIndex(index, safeImages.length)] : "";

  const go = useCallback((delta: number) => {
    if (!hasImages) return;
    setIndex((prev) => clampIndex(prev + delta, safeImages.length));
  }, [hasImages, safeImages.length]);

  useEffect(() => {
    if (!thumbRowRef.current || safeImages.length <= 0) return;
    const selected = clampIndex(index, safeImages.length);
    const el = thumbRowRef.current.querySelector<HTMLButtonElement>(`[data-thumb="${selected}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index, safeImages.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
        return;
      }
      if (!hasImages) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, hasImages]);

  const handleThumbnailClick = useCallback(
    (nextIndex: number) => {
      setIndex(nextIndex);
      onThumbnailSelect?.();

      // Keep mobile UX deterministic: thumbnail click should always bring the hero image back to the top.
      window.requestAnimationFrame(() => {
        galleryRootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [onThumbnailSelect],
  );

  return (
    <div ref={galleryRootRef} className="relative bg-[#0b0c0f]">
      <div className="relative h-[46vh] overflow-hidden md:h-[72vh]">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_20%,rgba(205,185,145,0.14),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0.38))]" />

        {hasImages ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSrc}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeSrc} alt="" className="absolute inset-0 h-full w-full scale-[1.08] object-cover blur-2xl opacity-40" />
              <div className="absolute inset-0 bg-black/25" />

              <motion.img
                src={activeSrc}
                alt={`${projectName} ${index + 1}`}
                className="absolute inset-0 h-full w-full object-contain"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 50) go(-1);
                  else if (info.offset.x < -50) go(1);
                }}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/40">
            <p className="text-[13px] font-semibold">이미지가 없습니다.</p>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
          <div className="rounded-2xl bg-black/40 px-3 py-2 backdrop-blur">
            <p className="font-eng text-[11px] font-bold tracking-[0.18em] text-white/70">
              {String(index + 1).padStart(2, "0")} / {String(safeImages.length).padStart(2, "0")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={!hasImages}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/40 text-white/85 backdrop-blur",
                "transition-colors hover:bg-black/45 disabled:opacity-40",
              )}
              aria-label="이전 이미지"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={!hasImages}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/40 text-white/85 backdrop-blur",
                "transition-colors hover:bg-black/45 disabled:opacity-40",
              )}
              aria-label="다음 이미지"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              disabled={!hasImages}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/40 text-white/85 backdrop-blur",
                "transition-colors hover:bg-black/45 disabled:opacity-40",
              )}
              aria-label="전체화면 보기"
            >
              <Expand className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {safeImages.length > 1 ? (
        <div className="sticky top-0 z-30 bg-[#0b0c0f]/96 shadow-[0_6px_16px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <div
            ref={thumbRowRef}
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 py-3 [scrollbar-width:none] md:px-5"
          >
            {safeImages.map((src, i) => {
              const selected = i === clampIndex(index, safeImages.length);
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  data-thumb={i}
                  onClick={() => handleThumbnailClick(i)}
                  className={cn(
                    "relative h-[44px] w-[66px] shrink-0 snap-center overflow-hidden rounded-lg transition-all md:h-[52px] md:w-[78px]",
                    selected ? "ring-2 ring-white/35" : "opacity-80 hover:opacity-100",
                  )}
                  aria-label={`${i + 1}번 이미지 보기`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0" />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {children ? <div className="relative">{children}</div> : null}

      <AnimatePresence>
        {isFullscreen && hasImages ? (
          <motion.div
            className="fixed inset-0 z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/82"
              onClick={() => setIsFullscreen(false)}
              aria-label="전체화면 닫기"
            />

            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-full max-w-[1400px]"
              >
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="absolute right-0 top-[-52px] inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/45 text-white/85 backdrop-blur hover:bg-black/58"
                  aria-label="닫기"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="overflow-hidden rounded-3xl bg-[#0b0c0f] shadow-[0_18px_40px_rgba(0,0,0,0.42)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeSrc} alt={`${projectName} fullscreen`} className="h-[72vh] w-full object-contain" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
