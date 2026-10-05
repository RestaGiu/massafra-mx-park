"use client";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  XIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react";
import { site } from "@/content/site";
import { copy } from "@/content/copy";
import type { Locale } from "@/i18n/routing";
import { MediaSlot } from "./media";

export function Gallery({ locale }: { locale: Locale }) {
  const t = copy[locale].gallery;
  const [active, setActive] = useState(0);
  return site.gallery.length ? (
    <Dialog.Root>
      <div className="horizontal-shell" data-pin>
        <div className="gallery-track" data-track>
          {site.gallery.map((media, i) => (
            <Dialog.Trigger
              key={media.src}
              className="gallery-item"
              aria-label={`${t.open}: ${media.caption?.[locale] || media.alt[locale]}`}
              onClick={() => setActive(i)}
            >
              <MediaSlot media={media} locale={locale} preview />
              <span>
                {media.caption?.[locale] || media.alt[locale]}
                <ArrowUpRightIcon size={20} />
              </span>
            </Dialog.Trigger>
          ))}
        </div>
      </div>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup className="lightbox">
          <Dialog.Title className="sr-only">{t.open}</Dialog.Title>
          <Dialog.Description>
            {site.gallery[active].alt[locale]}
          </Dialog.Description>
          <Dialog.Close
            className="icon-button close-button"
            aria-label={copy[locale].nav.close}
          >
            <XIcon size={26} />
          </Dialog.Close>
          <MediaSlot media={site.gallery[active]} locale={locale} />
          <div className="lightbox-controls">
            <button
              className="icon-button"
              aria-label={t.previous}
              onClick={() =>
                setActive(
                  (active - 1 + site.gallery.length) % site.gallery.length,
                )
              }
            >
              <ArrowLeftIcon size={25} />
            </button>
            <span>
              {active + 1} / {site.gallery.length}
            </span>
            <button
              className="icon-button"
              aria-label={t.next}
              onClick={() => setActive((active + 1) % site.gallery.length)}
            >
              <ArrowRightIcon size={25} />
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ) : (
    <div className="gallery-empty">
      <div className="gallery-preview">
        <MediaSlot locale={locale} label="MOTOCROSS" />
        <MediaSlot locale={locale} label="ENDURO" />
        <MediaSlot locale={locale} label="MINICROSS" />
      </div>
      <div className="gallery-note">
        <span className="mono">{t.mediaPending}</span>
        <p>{t.placeholder}</p>
        <a
          className="text-link"
          href={site.contacts.instagram}
          target="_blank"
          rel="noreferrer"
        >
          {t.follow}
          <ArrowUpRightIcon size={20} />
        </a>
      </div>
    </div>
  );
}
