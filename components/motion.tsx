"use client";
import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import type { Locale } from "@/i18n/routing";
import { copy } from "@/content/copy";

export function MotionControls({ locale }: { locale: Locale }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      className="motion-toggle"
      aria-pressed={paused}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        document.documentElement.dataset.motion = next ? "paused" : "active";
        window.dispatchEvent(new Event("mx-motion"));
      }}
    >
      {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}{" "}
      {paused ? copy[locale].footer.resume : copy[locale].footer.motion}
    </button>
  );
}

export function MotionLayer({ locale }: { locale: Locale }) {
  const loader = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const curtain = document.getElementById("language-curtain");
    try {
      if (sessionStorage.getItem("mx-language-transition")) {
        sessionStorage.removeItem("mx-language-transition");
        if (!reduce.matches)
          curtain?.animate(
            [
              { transform: "translateX(0) skewX(-12deg)" },
              { transform: "translateX(120%) skewX(-12deg)" },
            ],
            { duration: 300, easing: "cubic-bezier(.77,0,.175,1)" },
          );
      } else if (
        !sessionStorage.getItem("mx-visited") &&
        !reduce.matches &&
        !window.location.hash &&
        performance.now() < 350
      ) {
        if (loader.current) loader.current.hidden = false;
      }
      sessionStorage.setItem("mx-visited", "1");
    } catch {
      /* Content remains usable when browser storage is disabled. */
    }
    const timer = window.setTimeout(() => {
      if (loader.current) loader.current.hidden = true;
    }, 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let generation = 0;
    let clean: (() => void) | undefined;
    async function setup() {
      const current = ++generation;
      clean?.();
      clean = undefined;
      if (
        reduce.matches ||
        document.documentElement.dataset.motion === "paused"
      )
        return;
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);
      if (disposed || current !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const match = gsap.matchMedia();
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 32,
            duration: 0.65,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }),
        );
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const value = { n: 0 };
          const target = Number(el.dataset.count);
          gsap.to(value, {
            n: target,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = `${Math.round(value.n)}${el.dataset.suffix || ""}`;
            },
            onReverseComplete: () => {
              el.textContent = `${target}${el.dataset.suffix || ""}`;
            },
          });
        });
        const marquee = document.querySelector<HTMLElement>(".marquee-track");
        if (marquee) {
          const tween = gsap.to(marquee, {
            xPercent: -50,
            duration: 26,
            repeat: -1,
            ease: "none",
          });
          ScrollTrigger.create({
            onUpdate: (self) => {
              gsap.to(tween, {
                timeScale: 1 + Math.min(Math.abs(self.getVelocity()) / 2200, 2),
                duration: 0.5,
                overwrite: true,
              });
            },
          });
        }
      });
      match.add(
        "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
        () => {
          const lenis = new Lenis({
            duration: 0.85,
            smoothWheel: true,
            anchors: true,
            prevent: (node) =>
              !!node.closest('[role="dialog"], [data-native-scroll]'),
          });
          lenis.on("scroll", ScrollTrigger.update);
          const tick = (time: number) => lenis.raf(time * 1000);
          gsap.ticker.add(tick);
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) =>
            gsap.to(el, {
              yPercent: 8,
              scale: 1.03,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }),
          );
          gsap.utils.toArray<HTMLElement>("[data-pin]").forEach((shell) => {
            const track = shell.querySelector<HTMLElement>("[data-track]");
            if (!track || track.scrollWidth <= shell.clientWidth) return;
            gsap.to(track, {
              x: () => -(track.scrollWidth - shell.clientWidth),
              ease: "none",
              scrollTrigger: {
                trigger: shell,
                start: "top 110px",
                end: () => `+=${track.scrollWidth - shell.clientWidth}`,
                pin: true,
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            });
          });
          const moveCursor = (event: PointerEvent) => {
            if (!cursor.current) return;
            gsap.to(cursor.current, {
              x: event.clientX,
              y: event.clientY,
              opacity: 1,
              duration: 0.15,
              overwrite: true,
            });
            cursor.current.classList.toggle(
              "is-link",
              !!(event.target as Element).closest("a,button"),
            );
          };
          const hideCursor = () =>
            gsap.to(cursor.current, { opacity: 0, duration: 0.15 });
          window.addEventListener("pointermove", moveCursor);
          document.addEventListener("pointerleave", hideCursor);
          const magnetCleanups: (() => void)[] = [];
          document
            .querySelectorAll<HTMLElement>("[data-magnetic]")
            .forEach((button) => {
              const move = (event: PointerEvent) => {
                const rect = button.getBoundingClientRect();
                gsap.to(button, {
                  x: (event.clientX - rect.left - rect.width / 2) * 0.08,
                  y: (event.clientY - rect.top - rect.height / 2) * 0.12,
                  duration: 0.2,
                  overwrite: true,
                });
              };
              const leave = () => {
                gsap.to(button, {
                  x: 0,
                  y: 0,
                  duration: 0.25,
                  ease: "power4.out",
                });
              };
              button.addEventListener("pointermove", move);
              button.addEventListener("pointerleave", leave);
              magnetCleanups.push(() => {
                button.removeEventListener("pointermove", move);
                button.removeEventListener("pointerleave", leave);
                gsap.set(button, { clearProps: "transform" });
              });
            });
          return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
            window.removeEventListener("pointermove", moveCursor);
            document.removeEventListener("pointerleave", hideCursor);
            magnetCleanups.forEach((fn) => fn());
            if (cursor.current) cursor.current.style.opacity = "0";
          };
        },
      );
      ScrollTrigger.refresh();
      clean = () => {
        match.revert();
        context.revert();
        document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          el.textContent = `${el.dataset.count}${el.dataset.suffix || ""}`;
        });
      };
    }
    const timer = window.setTimeout(setup, 1100);
    reduce.addEventListener("change", setup);
    window.addEventListener("mx-motion", setup);
    return () => {
      disposed = true;
      generation++;
      window.clearTimeout(timer);
      clean?.();
      reduce.removeEventListener("change", setup);
      window.removeEventListener("mx-motion", setup);
    };
  }, []);
  return (
    <>
      <div ref={loader} className="intro-loader" hidden>
        <div className="intro-flag checker" />
        <span aria-hidden="true">
          MASSAFRA
          <br />
          <i>MX PARK</i>
        </span>
        <button
          onClick={() => {
            if (loader.current) loader.current.hidden = true;
          }}
        >
          {copy[locale].hero.skip} ↗
        </button>
      </div>
      <div ref={cursor} className="custom-cursor" aria-hidden="true" />
    </>
  );
}
