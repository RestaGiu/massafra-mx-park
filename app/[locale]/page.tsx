import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  ArrowUpRightIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  WhatsappLogoIcon,
  InstagramLogoIcon,
  FacebookLogoIcon,
  FlagCheckeredIcon,
  MapPinIcon,
} from "@phosphor-icons/react/dist/ssr";
import { routing, type Locale } from "@/i18n/routing";
import { site, whatsappUrl } from "@/content/site";
import { copy } from "@/content/copy";
import { MediaSlot } from "@/components/media";
import { BookingForm } from "@/components/booking-form";
import { Gallery } from "@/components/gallery";
import { ParkMap } from "@/components/map";
import { MotionLayer, MotionControls } from "@/components/motion";
import { LanguageSwitcher } from "@/components/header";
import { metadata, origin } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  return metadata((await params).locale);
}
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = copy[locale];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsActivityLocation",
        "@id": `${origin}/#park`,
        name: site.name,
        url: `${origin}/${locale}`,
        telephone: site.contacts.phone,
        email: site.contacts.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address,
          addressLocality: "Ginosa",
          addressRegion: "TA",
          postalCode: "74013",
          addressCountry: "IT",
        },
        sameAs: [site.contacts.instagram, site.contacts.facebook],
        ...(site.openingHours.length
          ? { openingHours: site.openingHours }
          : {}),
      },
      ...site.races.map((r) => ({
        "@type": "SportsEvent",
        name: r.title,
        startDate: r.date,
        location: { "@id": `${origin}/#park` },
        organizer: { "@type": "SportsOrganization", name: "ASD Massafra MX" },
        sport: "Motocross",
      })),
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <section className="hero" id="hero">
          <MediaSlot
            media={site.hero}
            locale={locale}
            priority
            className="hero-media"
          />
          <div className="hero-speed" aria-hidden="true" />
          <div className="hero-content container">
            <div className="hero-topline">
              <span className="mono">
                <MapPinIcon size={15} />
                {t.hero.location}
              </span>
              <span
                className={`status ${site.status.open ? "" : "is-closed"}`}
                role="status"
                aria-live="polite"
              >
                <span />
                {site.status.message[locale]}
              </span>
            </div>
            <h1>
              <span className="hero-line">{t.hero.line1}</span>
              <span className="hero-line orange">{t.hero.line2}</span>
            </h1>
            <div className="hero-bottom">
              <p>{t.hero.sub}</p>
              <div className="hero-actions">
                <a
                  className="button"
                  data-magnetic
                  href={whatsappUrl(locale)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.nav.book}
                  <ArrowUpRightIcon size={23} />
                </a>
                <a
                  className="button secondary"
                  href={whatsappUrl(locale, true)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.hero.rental}
                  <ArrowUpRightIcon size={22} />
                </a>
              </div>
            </div>
            <div className="hero-foot">
              <a href="#park" className="scroll-cue">
                <ArrowDownIcon size={19} />
                {t.hero.scroll}
              </a>
              <span className="mono">MOTOCROSS / ENDURO / MINICROSS</span>
              <span className="mini-checker" aria-hidden="true" />
            </div>
          </div>
        </section>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((n) => (
              <span key={n}>
                MOTOCROSS <i>✳</i> ENDURO <i>✳</i> MINICROSS <i>✳</i> NOLEGGIO{" "}
                <i>✳</i> UISP <i>✳</i>{" "}
              </span>
            ))}
          </div>
        </div>
        <section id="park" className="section container park">
          <h2 className="headline" data-reveal>
            {t.park.title}
          </h2>
          <p className="section-intro">{t.park.intro}</p>
          <div className="track-grid">
            {[
              { name: "MOTOCROSS", description: t.park.mx },
              { name: "ENDURO", description: t.park.enduro },
              { name: "MINICROSS", description: t.park.mini },
            ].map((track, i) => (
              <a
                className={`track-card track-${i}`}
                href="#prenota"
                key={track.name}
              >
                <div className="track-visual">
                  <MediaSlot
                    media={site.trackMedia[i]}
                    locale={locale}
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                  <span className="track-number mono">0{i + 1}</span>
                  <ArrowUpRightIcon className="track-arrow" size={28} />
                </div>
                <div className="track-copy">
                  <h3>{track.name}</h3>
                  <p>{track.description}</p>
                  <span className="text-link">
                    {t.park.discover}
                    <ArrowRightIcon size={17} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section id="noleggio" className="rental-section">
          <div className="container rental-grid">
            <div className="rental-art" data-parallax>
              <MediaSlot media={site.rentalMedia} locale={locale} />
              <div aria-hidden="true" className="rental-kinetic">
                {t.rental.line1}
                <br />
                <span>{t.rental.line2}</span>
              </div>
              <span className="rental-stamp">
                <FlagCheckeredIcon size={23} />
                {t.rental.kicker}
              </span>
            </div>
            <div className="rental-copy" data-reveal>
              <span className="eyebrow">{t.rental.kicker}</span>
              <h2 className="headline">{t.rental.title}</h2>
              <p>{t.rental.text}</p>
              {site.rentalFleet.length > 0 && (
                <ul>
                  {site.rentalFleet.map((b) => (
                    <li key={b.name}>
                      <strong>{b.name}</strong> {b.description[locale]}
                    </li>
                  ))}
                </ul>
              )}
              {!site.rentalIncludes[locale].startsWith("TODO_CLIENTE") && (
                <p>{site.rentalIncludes[locale]}</p>
              )}
              <a
                className="button"
                data-magnetic
                href={whatsappUrl(locale, true)}
                target="_blank"
                rel="noreferrer"
              >
                {t.rental.cta}
                <ArrowUpRightIcon size={22} />
              </a>
              <a
                className="rental-phone"
                href={`tel:+${site.contacts.whatsapp}`}
              >
                {site.contacts.phone}
              </a>
              <p className="muted small-copy">{t.rental.details}</p>
            </div>
          </div>
        </section>
        <section id="prenota" className="section container booking-section">
          <div className="booking-copy">
            <span className="eyebrow">{t.nav.book.toUpperCase()}</span>
            <h2 className="headline" data-reveal>
              {t.booking.title}
            </h2>
            <p>{t.booking.text}</p>
            <MediaSlot
              media={site.bookingMedia}
              locale={locale}
              className="booking-photo"
            />
            <div className="booking-status">
              <span className={`status ${site.status.open ? "" : "is-closed"}`}>
                <span />
                {site.status.message[locale]}
              </span>
              <p>{site.status.note[locale]}</p>
            </div>
          </div>
          <BookingForm locale={locale} />
        </section>
        <section id="gare" className="races-section">
          <div className="container">
            <div className="race-feature">
              <MediaSlot
                media={site.raceMedia}
                locale={locale}
                className="race-feature-media"
                sizes="100vw"
              />
              <div className="race-feature-copy">
                <h2 className="headline" data-reveal>
                  {t.races.title}
                </h2>
                <p className="section-intro">{t.races.intro}</p>
              </div>
            </div>
            <div className="race-toolbar">
              <span className="series-name">
                TROFEO SUD ITALIA <b>MX UISP</b>
              </span>
              <a
                className="text-link"
                href={site.liveTimingUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t.races.timing}
                <ArrowUpRightIcon size={21} />
              </a>
            </div>
            {site.races.length ? (
              <div className="horizontal-shell" data-pin>
                <div className="race-track" data-track>
                  {site.races.map((r) => (
                    <article className="race-card" key={r.title + r.date}>
                      <time dateTime={r.date}>
                        {new Intl.DateTimeFormat(locale, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          timeZone: "Europe/Rome",
                        }).format(new Date(r.date))}
                      </time>
                      <h3>{r.title}</h3>
                      <p>{r.series}</p>
                      <p>{r.category}</p>
                      {r.liveTimingUrl && (
                        <a
                          className="text-link"
                          href={r.liveTimingUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.races.timing} ↗
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="race-empty">
                <FlagCheckeredIcon size={54} weight="duotone" />
                <div>
                  <h3>{t.races.empty}</h3>
                  <p>{t.races.emptyText}</p>
                </div>
                <a
                  className="button secondary"
                  href={site.contacts.facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.races.social}
                  <ArrowUpRightIcon size={21} />
                </a>
              </div>
            )}
            <div className="categories">
              <span className="mono">{t.races.categories}</span>
              {[
                "MX1",
                "MX2",
                "Esperti",
                "Agonisti",
                "Amatori",
                "Open 2T",
                "Epoca",
                "Femminile",
                "Minicross 65 / 85",
              ].map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <div className="numbers">
              <div>
                <span className="mono">{t.races.archive}</span>
                <strong>
                  <span className="sr-only">100+</span>
                  <span aria-hidden="true" data-count="100" data-suffix="+">
                    100+
                  </span>
                </strong>
                <p>{t.races.riders}</p>
              </div>
              <div>
                <strong>
                  <span className="sr-only">4</span>
                  <span aria-hidden="true" data-count="4">
                    4
                  </span>
                </strong>
                <p>{t.races.regions}</p>
                <span className="muted">{t.races.community}</span>
              </div>
            </div>
          </div>
        </section>
        <section id="galleria" className="section container gallery-section">
          <h2 className="headline" data-reveal>
            {t.gallery.title}
          </h2>
          <p className="section-intro">{t.gallery.intro}</p>
          <Gallery locale={locale} />
        </section>
        <section id="team" className="team-section container">
          <div className="team-title">
            <span className="eyebrow">{t.team.kicker}</span>
            <h2 className="headline" data-reveal>
              {t.team.title}
            </h2>
          </div>
          <div className="team-story">
            {site.teamMedia && (
              <MediaSlot media={site.teamMedia} locale={locale} />
            )}
            <p>{t.team.text}</p>
            <a
              className="text-link"
              href={site.contacts.facebook}
              target="_blank"
              rel="noreferrer"
            >
              {t.team.cta}
              <ArrowUpRightIcon size={20} />
            </a>
          </div>
        </section>
        <section id="dove" className="location-section">
          <div className="container location-grid">
            <div>
              <h2 className="headline" data-reveal>
                {t.location.title}
              </h2>
              <p>{t.location.text}</p>
              <address>{site.address}</address>
              <a
                className="button"
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t.location.directions}
                <ArrowUpRightIcon size={22} />
              </a>
              <div className="opening-note">
                <strong>{t.location.open}</strong>
                <p>{t.location.contact}</p>
              </div>
            </div>
            <ParkMap locale={locale} />
          </div>
        </section>
      </main>
      <footer id="contatti" className="footer">
        <MediaSlot
          media={site.footerMedia}
          locale={locale}
          className="footer-media"
          sizes="100vw"
          decorative
        />
        <div className="container">
          <div className="footer-top">
            <h2>{t.footer.title}</h2>
            <a
              className="footer-wa"
              href={whatsappUrl(locale)}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <WhatsappLogoIcon size={54} />
              <ArrowUpRightIcon size={28} />
            </a>
          </div>
          <div className="footer-columns">
            <div>
              <span className="mono">{t.footer.contact}</span>
              <a href={`tel:+${site.contacts.whatsapp}`}>
                {site.contacts.phone}
              </a>
              <a href={`mailto:${site.contacts.email}`}>
                {site.contacts.email}
              </a>
            </div>
            <div>
              <span className="mono">{t.footer.social}</span>
              <a
                href={site.contacts.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <InstagramLogoIcon size={20} />
                Instagram ↗
              </a>
              <a href={site.contacts.facebook} target="_blank" rel="noreferrer">
                <FacebookLogoIcon size={20} />
                Facebook ↗
              </a>
            </div>
            <div className="footer-utilities">
              <LanguageSwitcher locale={locale} />
              <MotionControls locale={locale} />
              <a className="text-link" href="#hero">
                {t.footer.top} ↑
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>
              <span>{t.footer.rights}</span>
              <small>{t.footer.legal}</small>
            </div>
            <div>
              <a href={`/${locale}/privacy`}>{t.footer.privacy}</a>
              <a href={`/${locale}/cookies`}>{t.footer.cookies}</a>
            </div>
          </div>
          <p className="imagery-notice">{site.imageryNotice[locale]}</p>
        </div>
        <div className="tricolore" aria-hidden="true" />
      </footer>
      <div className="mobile-booking">
        <a href={whatsappUrl(locale)} target="_blank" rel="noreferrer">
          <WhatsappLogoIcon size={22} />
          {t.nav.book}
          <ArrowUpRightIcon size={20} />
        </a>
        <a
          href="#prenota"
          aria-label={
            locale === "it"
              ? "Apri modulo di prenotazione"
              : "Open booking form"
          }
        >
          <ArrowRightIcon size={23} />
        </a>
      </div>
      <MotionLayer locale={locale} />
    </>
  );
}
