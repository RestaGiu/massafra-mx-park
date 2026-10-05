export type Localized = { it: string; en: string };
export type Media = {
  src: string;
  alt: Localized;
  type: "image" | "video";
  poster?: string;
  generated?: boolean;
  caption?: Localized;
  position?: string;
};
export type Race = {
  date: string;
  title: string;
  series: string;
  category: string;
  liveTimingUrl?: string;
};

const visual = (
  key: string,
  it: string,
  en: string,
  caption: Localized,
  position = "50% 50%",
): Media => ({
  src: `/media/${key}-ai.webp`,
  type: "image",
  generated: true,
  position,
  caption,
  alt: {
    it: `Immagine illustrativa AI: ${it}`,
    en: `AI-generated illustration: ${en}`,
  },
});
const visuals = {
  hero: visual(
    "hero",
    "pilota di motocross in curva tra terra e polvere in controluce",
    "motocross rider cornering through backlit dirt and dust",
    { it: "Dentro la curva", en: "Into the corner" },
    "72% 50%",
  ),
  motocross: visual(
    "motocross",
    "pilota con protezioni in salto su una moto da cross",
    "fully equipped rider jumping a dirt bike",
    { it: "Un attimo in volo", en: "A moment in the air" },
    "52% 47%",
  ),
  enduro: visual(
    "enduro",
    "pilota di enduro su un sentiero tra ulivi e rocce",
    "enduro rider on a trail among olive trees and rocks",
    { it: "La tua linea", en: "Your own line" },
    "50% 52%",
  ),
  minicross: visual(
    "minicross",
    "giovane pilota con equipaggiamento protettivo su una piccola moto, seguito da un adulto",
    "junior rider in protective equipment on a small dirt bike, supervised by an adult",
    { it: "La passione comincia qui", en: "Passion starts here" },
    "53% 50%",
  ),
  rental: visual(
    "rental",
    "moto e attrezzatura in un paddock immaginario, non rappresentativi della flotta reale",
    "motorcycle and equipment in a fictional paddock, not the actual rental fleet",
    { it: "Pronti a partire", en: "Ready to ride" },
    "62% 50%",
  ),
  community: visual(
    "community",
    "gruppo immaginario di appassionati di motocross al tramonto, non il team reale",
    "fictional group of motocross enthusiasts at sunset, not the actual team",
    { it: "La stessa passione", en: "The same passion" },
    "50% 45%",
  ),
  race: visual(
    "race",
    "gruppo di piloti in una gara immaginaria, non una fotografia di un evento reale",
    "riders in an imagined race, not a photograph of a real event",
    { it: "Si parte", en: "And we’re off" },
    "65% 48%",
  ),
  detail: visual(
    "detail",
    "pilota che si prepara con casco, occhiali e guanti",
    "rider getting ready with helmet, goggles and gloves",
    { it: "Prima del prossimo giro", en: "Before the next lap" },
    "45% 40%",
  ),
};

// A única fonte de dados do negócio. TODO_CLIENTE nunca é apresentado como fato.
export const site = {
  name: "Massafra MX Park",
  status: {
    open: true,
    message: { it: "Pista aperta oggi", en: "Track open today" },
    note: {
      it: "In caso di maltempo, controlla gli aggiornamenti sui nostri social prima di partire.",
      en: "In bad weather, check our social updates before setting off.",
    },
  },
  contacts: {
    phone: "+39 345 030 9633",
    whatsapp: "393450309633",
    email: "massafra.mxteam@gmail.com",
    instagram: "https://www.instagram.com/massaframxpark/",
    facebook: "https://www.facebook.com/massaframxpark/",
  },
  address: "GR87+8F, 74013 Ginosa (TA)",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=GR87%2B8F%20Ginosa%20Massafra%20MX%20Park",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Massafra%20MX%20Park%20Ginosa&t=&z=13&ie=UTF8&iwloc=&output=embed",
  liveTimingUrl: "https://www.ultracross.it/",
  hours: "TODO_CLIENTE",
  openingHours: [] as string[], // TODO_CLIENTE: somente horários confirmados, formato schema.org.
  prices: "TODO_CLIENTE",
  rentalFleet: [] as { name: string; description: Localized }[], // TODO_CLIENTE: modelos, cilindrata, faixa etária.
  rentalIncludes: { it: "TODO_CLIENTE", en: "TODO_CLIENTE" },
  races: [] as Race[], // TODO_CLIENTE: datas ISO com fuso, título, série, categorias. Não inventar etapas futuras.
  gallery: [
    visuals.motocross,
    visuals.detail,
    visuals.enduro,
    visuals.race,
    visuals.minicross,
    visuals.community,
  ] as Media[],
  hero: visuals.hero,
  trackMedia: [visuals.motocross, visuals.enduro, visuals.minicross],
  rentalMedia: visuals.rental,
  teamMedia: visuals.community,
  bookingMedia: visuals.detail,
  raceMedia: visuals.race,
  footerMedia: visuals.hero,
  imageryNotice: {
    it: "Immagini illustrative generate con AI. Non rappresentano la pista, la flotta o il team reali.",
    en: "Illustrative AI-generated images. They do not depict the actual track, rental fleet or team.",
  },
  logo: "TODO_CLIENTE",
  legal: {
    name: "TODO_CLIENTE",
    vat: "TODO_CLIENTE",
    controller: "TODO_CLIENTE",
    retention: "TODO_CLIENTE",
    hostingProvider: "TODO_CLIENTE",
    legalBasis: "TODO_CLIENTE",
    safety: { it: "TODO_CLIENTE", en: "TODO_CLIENTE" },
  },
  effects: { grain: true },
};

export function whatsappUrl(locale: "it" | "en", rental = false) {
  const text = rental
    ? locale === "it"
      ? "Ciao! Vorrei informazioni sul noleggio moto al Massafra MX Park. Data: __ / Categoria: __."
      : "Hi! I'd like to rent a bike at Massafra MX Park. Date: __ / Category: __."
    : locale === "it"
      ? "Ciao! Vorrei prenotare un giro al Massafra MX Park. Data: __ / Categoria: __ / Mi serve la moto a noleggio: sì/no."
      : "Hi! I'd like to book a session at Massafra MX Park. Date: __ / Category: __ / I need a rental bike: yes/no.";
  return `https://wa.me/${site.contacts.whatsapp}?text=${encodeURIComponent(text)}`;
}
