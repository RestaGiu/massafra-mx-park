"use client";
import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ListIcon, XIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { copy } from "@/content/copy";
import { withoutBasePath } from "@/lib/paths";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const localPathname = withoutBasePath(pathname);
  function switchLanguage(
    event: React.MouseEvent<HTMLAnchorElement>,
    target: Locale,
  ) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      locale === target
    )
      return;
    event.preventDefault();
    const sections = [
      ...document.querySelectorAll<HTMLElement>("main section[id]"),
    ];
    const section = sections
      .filter(
        (el) => el.getBoundingClientRect().top <= window.innerHeight * 0.45,
      )
      .at(-1);
    const hash = section ? `#${section.id}` : window.location.hash;
    // next-intl stores the explicit /it or /en choice in NEXT_LOCALE on navigation.
    const destination = event.currentTarget.pathname + hash;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "paused"
    ) {
      window.location.assign(destination);
      return;
    }
    const curtain = document.getElementById("language-curtain");
    if (!curtain) {
      window.location.assign(destination);
      return;
    }
    const animation = curtain.animate(
      [
        { transform: "translateX(-120%) skewX(-12deg)" },
        { transform: "translateX(0) skewX(-12deg)" },
      ],
      { duration: 300, fill: "forwards", easing: "cubic-bezier(.77,0,.175,1)" },
    );
    try {
      sessionStorage.setItem("mx-language-transition", "1");
    } catch {
      /* Navigation also works with disabled storage. */
    }
    animation.finished.then(() => window.location.assign(destination));
  }
  return (
    <div className="languages" aria-label={copy[locale].nav.language}>
      {(["it", "en"] as const).map((lang) => (
        <Link
          key={lang}
          href={localPathname.replace(/^\/(it|en)/, `/${lang}`)}
          hrefLang={lang}
          lang={lang}
          aria-current={locale === lang ? "page" : undefined}
          onClick={(e) => switchLanguage(e, lang)}
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      document
        .querySelector(".site-header")
        ?.classList.toggle("is-scrolled", !entry.isIntersecting),
    );
    const sentinel = document.getElementById("top-sentinel");
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);
  const links = [
    ["park", t.nav.park],
    ["noleggio", t.nav.rental],
    ["gare", t.nav.races],
    ["galleria", t.nav.gallery],
    ["dove", t.nav.location],
  ];
  return (
    <>
      <header className="site-header">
        <Link className="wordmark" href={`/${locale}`}>
          {!site.logo.startsWith("TODO_CLIENTE") ? (
            <Image
              src={site.logo}
              alt="Massafra MX Park"
              width={150}
              height={48}
              className="client-logo"
            />
          ) : (
            <>
              <span className="wordmark-symbol" aria-hidden="true">
                M<span>X</span>
              </span>
              <span>
                MASSAFRA <small>MX PARK</small>
              </span>
            </>
          )}
        </Link>
        <nav
          className="desktop-nav"
          aria-label={
            locale === "it" ? "Navigazione principale" : "Main navigation"
          }
        >
          {links.map(([id, label]) => (
            <Link href={`/${locale}#${id}`} key={id}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <LanguageSwitcher locale={locale} />
          <Link href={`/${locale}#prenota`} className="button small nav-book">
            {t.nav.book}
            <ArrowUpRightIcon size={18} />
          </Link>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="menu-trigger icon-button"
              aria-label={t.nav.menu}
            >
              <ListIcon size={26} />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="dialog-backdrop" />
              <Dialog.Popup className="mobile-menu">
                <Dialog.Title className="sr-only">{t.nav.menu}</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Massafra MX Park
                </Dialog.Description>
                <Dialog.Close
                  className="icon-button close-button"
                  aria-label={t.nav.close}
                >
                  <XIcon size={28} />
                </Dialog.Close>
                <nav>
                  {[...links, ["prenota", t.nav.book]].map(([id, label], i) => (
                    <Link
                      style={{ animationDelay: `${i * 50}ms` }}
                      key={id}
                      href={`/${locale}#${id}`}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                      <ArrowUpRightIcon size={28} />
                    </Link>
                  ))}
                </nav>
                <span className="mono">GINOSA (TA), PUGLIA</span>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
      <div id="language-curtain" aria-hidden="true">
        <div className="checker" />
      </div>
    </>
  );
}
