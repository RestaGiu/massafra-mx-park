import Image from "next/image";
import type { Media } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { ParkVideo } from "./park-video";
export function MediaSlot({
  media,
  locale,
  className = "",
  priority = false,
  label = "",
  preview = false,
  sizes,
  decorative = false,
}: {
  media?: Media | null;
  locale: Locale;
  className?: string;
  priority?: boolean;
  label?: string;
  preview?: boolean;
  sizes?: string;
  decorative?: boolean;
}) {
  return (
    <div
      className={`media-slot ${media?.generated ? "generated-media" : ""} ${className}`}
    >
      {media?.src ? (
        media.type === "image" ? (
          <Image
            src={media.src}
            alt={decorative ? "" : media.alt[locale]}
            fill
            sizes={
              sizes || (priority ? "100vw" : "(max-width: 767px) 100vw, 50vw")
            }
            priority={priority}
            className="media-image"
            style={{ objectPosition: media.position }}
          />
        ) : (
          <ParkVideo media={media} locale={locale} preview={preview} />
        )
      ) : (
        <div className="media-placeholder" aria-hidden="true">
          <div className="placeholder-checks" />
          <span className="placeholder-mark">MX</span>
          {label && <span className="placeholder-label">{label}</span>}
        </div>
      )}
      {media?.generated && !decorative && (
        <span className="media-credit" aria-hidden="true">
          {locale === "it" ? "Immagine AI" : "AI visual"}
        </span>
      )}
    </div>
  );
}
