"use client";
import { useState } from "react";
import {
  ArrowUpRightIcon,
  WhatsappLogoIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { copy } from "@/content/copy";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";

export function BookingForm({ locale }: { locale: Locale }) {
  const t = copy[locale].booking;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ready, setReady] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) || "").trim();
    const next: Record<string, string> = {};
    ["name", "phone", "date", "category", "people"].forEach((key) => {
      if (!value(key)) next[key] = t.required;
    });
    if (value("phone") && !/^\+?[\d\s().-]{7,25}$/.test(value("phone")))
      next.phone = t.invalidPhone;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(`${value("date")}T00:00:00`);
    if (value("date") && (!Number.isFinite(chosen.getTime()) || chosen < today))
      next.date = t.invalidDate;
    if (
      value("people") &&
      (!Number.isInteger(Number(value("people"))) ||
        Number(value("people")) < 1)
    )
      next.people = t.invalidPeople;
    if (
      value("category") &&
      !["MX", "Enduro", "Minicross"].includes(value("category"))
    )
      next.category = t.required;
    setErrors(next);
    setReady("");
    if (Object.keys(next).length) {
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    const text = `${locale === "it" ? "Ciao! Vorrei prenotare un giro al Massafra MX Park." : "Hi! I'd like to book a session at Massafra MX Park."}\n${t.name}: ${value("name")}\n${t.phone}: ${value("phone")}\n${t.date}: ${value("date")}\n${t.category}: ${value("category")}\n${t.rental}: ${value("rental") === "yes" ? t.yes : t.no}\n${t.people}: ${value("people")}${value("message") ? `\n${t.message}: ${value("message")}` : ""}`;
    const mode = (event.nativeEvent as SubmitEvent).submitter?.getAttribute(
      "value",
    );
    const wa = `https://wa.me/${site.contacts.whatsapp}?text=${encodeURIComponent(text)}`;
    if (mode === "email") {
      window.location.href = `mailto:${site.contacts.email}?subject=${encodeURIComponent("Massafra MX Park - " + value("date"))}&body=${encodeURIComponent(text)}`;
    } else {
      setReady(wa);
      window.open(wa, "_blank", "noopener,noreferrer");
    }
  }
  const field = (name: string) => ({
    id: name,
    name,
    "aria-label":
      t[name as "name" | "phone" | "date" | "category" | "people" | "message"],
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const error = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  return (
    <form className="booking-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label htmlFor="name">
          {t.name}
          <input
            {...field("name")}
            autoComplete="name"
            required
            maxLength={100}
          />
          {error("name")}
        </label>
        <label htmlFor="phone">
          {t.phone}
          <input
            {...field("phone")}
            type="tel"
            autoComplete="tel"
            placeholder="+39"
            required
            maxLength={25}
          />
          {error("phone")}
        </label>
        <label htmlFor="date">
          {t.date}
          <input {...field("date")} type="date" required />
          {error("date")}
        </label>
        <label htmlFor="category">
          {t.category}
          <select {...field("category")} defaultValue="" required>
            <option value="" disabled>
              {t.select}
            </option>
            <option value="MX">Motocross</option>
            <option value="Enduro">Enduro</option>
            <option value="Minicross">Minicross</option>
          </select>
          {error("category")}
        </label>
        <fieldset>
          <legend>{t.rental}</legend>
          <div className="radio-options">
            <label>
              <input type="radio" name="rental" value="yes" defaultChecked />
              {t.yes}
            </label>
            <label>
              <input type="radio" name="rental" value="no" />
              {t.no}
            </label>
          </div>
        </fieldset>
        <label htmlFor="people">
          {t.people}
          <input
            {...field("people")}
            type="number"
            min="1"
            step="1"
            defaultValue="1"
            required
          />
          {error("people")}
        </label>
        <label className="full" htmlFor="message">
          {t.message} <span className="optional">({t.optional})</span>
          <textarea {...field("message")} rows={3} maxLength={1500} />
        </label>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {Object.keys(errors).length > 0 && (
          <p className="form-error">{t.error}</p>
        )}
        {ready && (
          <div className="form-success" role="status">
            <CheckCircleIcon size={24} />
            <div>
              {t.ready}
              <a href={ready} target="_blank" rel="noreferrer">
                {t.reopen} ↗
              </a>
            </div>
          </div>
        )}
      </div>
      <button className="button form-submit" type="submit" value="whatsapp">
        <WhatsappLogoIcon size={22} />
        {t.submit}
        <ArrowUpRightIcon size={20} />
      </button>
      <button className="text-link email-fallback" type="submit" value="email">
        {t.email}
        <ArrowUpRightIcon size={16} />
      </button>
      <p className="form-privacy">
        {t.privacy} <a href={`/${locale}/privacy`}>{t.policy}</a>.
      </p>
      <noscript>
        <p>
          {locale === "it"
            ? "Per prenotare senza JavaScript, scrivici:"
            : "To book without JavaScript, email us:"}{" "}
          <a href={`mailto:${site.contacts.email}`}>{site.contacts.email}</a>
        </p>
      </noscript>
    </form>
  );
}
