"use client";
import { useState } from "react";
import { MapPinIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { copy } from "@/content/copy";
import type { Locale } from "@/i18n/routing";
export function ParkMap({ locale }: { locale: Locale }) {
  const [loaded, setLoaded] = useState(false);
  const t = copy[locale].location;
  return (
    <div className="map-panel">
      {loaded ? (
        <iframe
          title={t.title.replace("\n", " ")}
          src={site.mapEmbedUrl}
          referrerPolicy="no-referrer"
          loading="lazy"
          allowFullScreen
        />
      ) : (
        <div className="map-consent">
          <MapPinIcon size={44} weight="duotone" />
          <strong>
            GINOSA<span>PUGLIA, ITALIA</span>
          </strong>
          <button className="button secondary" onClick={() => setLoaded(true)}>
            {t.loadMap}
            <ArrowUpRightIcon size={20} />
          </button>
          <p>{t.mapNotice}</p>
        </div>
      )}
    </div>
  );
}
