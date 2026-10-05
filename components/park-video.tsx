"use client";
import { useEffect, useRef } from "react";
import type { Media } from "@/content/site";
import type { Locale } from "@/i18n/routing";
export function ParkVideo({
  media,
  locale,
  preview = false,
}: {
  media: Media;
  locale: Locale;
  preview?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      if (
        visible &&
        !reduce.matches &&
        document.documentElement.dataset.motion !== "paused"
      )
        void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    reduce.addEventListener("change", update);
    window.addEventListener("mx-motion", update);
    return () => {
      observer.disconnect();
      reduce.removeEventListener("change", update);
      window.removeEventListener("mx-motion", update);
      video.pause();
    };
  }, []);
  return (
    <video
      ref={ref}
      className="media-image"
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      controls={!preview}
      preload="none"
      aria-label={media.alt[locale]}
    />
  );
}
