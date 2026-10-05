import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import { metadata } from "@/lib/seo";
export function generateStaticParams() {
  return [{ policy: "privacy" }, { policy: "cookies" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; policy: string }>;
}) {
  const { locale, policy } = await params;
  return {
    ...metadata(
      locale,
      `/${policy}`,
      `${policy === "privacy" ? "Privacy Policy" : "Cookie Policy"} | Massafra MX Park`,
    ),
    robots: { index: false, follow: true },
  };
}
export default async function Policy({
  params,
}: {
  params: Promise<{ locale: string; policy: string }>;
}) {
  const { locale, policy } = await params;
  if (
    !hasLocale(routing.locales, locale) ||
    !["privacy", "cookies"].includes(policy)
  )
    notFound();
  setRequestLocale(locale);
  const it = locale === "it";
  const privacy = policy === "privacy";
  return (
    <main className="container legal-page" id="main">
      <a className="back-link" href={`/${locale}`}>
        ← Massafra MX Park
      </a>
      <h1>{privacy ? "PRIVACY POLICY" : "COOKIE POLICY"}</h1>
      <p className="legal-draft">
        {it
          ? "BOZZA DA COMPLETARE. TODO_CLIENTE: questa informativa deve essere verificata e approvata dal titolare prima della pubblicazione."
          : "DRAFT TO COMPLETE. TODO_CLIENTE: the data controller must review and approve this notice before publication."}
      </p>
      {privacy ? (
        <>
          <h2>{it ? "Titolare e contatti" : "Controller and contact"}</h2>
          <p>
            {it ? "Titolare del trattamento" : "Data controller"}:{" "}
            {site.legal.controller}. {it ? "Ragione sociale" : "Legal entity"}:{" "}
            {site.legal.name}. P.IVA: {site.legal.vat}.{" "}
            {it ? "Contatto" : "Contact"}:{" "}
            <a href={`mailto:${site.contacts.email}`}>{site.contacts.email}</a>.
          </p>
          <h2>{it ? "Come funziona il modulo" : "How the form works"}</h2>
          <p>
            {it
              ? "Nome, telefono, data, disciplina, preferenza di noleggio, numero di persone e messaggio vengono utilizzati per preparare una richiesta. Il sito non invia questi dati a un proprio database. Se scegli WhatsApp o e-mail, i dati vengono passati al servizio selezionato; devi inviare il messaggio per contattare il team."
              : "Your name, phone number, date, discipline, rental preference, group size and message are used to prepare an enquiry. This website does not send these details to its own database. When you choose WhatsApp or email, the details are passed to the selected service; you must send the message to contact the team."}
          </p>
          <h2>
            {it
              ? "Finalità, base giuridica e conservazione"
              : "Purpose, legal basis and retention"}
          </h2>
          <p>
            {it
              ? "Finalità prevista: rispondere alle richieste di informazioni e prenotazione. Il titolare deve confermare la base giuridica, i tempi di conservazione e le procedure adottate su WhatsApp, e-mail e presso il fornitore di hosting."
              : "Intended purpose: responding to enquiries and booking requests. The controller must confirm the legal basis, retention periods and procedures used for WhatsApp, email and hosting."}{" "}
            TODO_CLIENTE: {site.legal.legalBasis}; {site.legal.retention};{" "}
            {site.legal.hostingProvider}.
          </p>
          <h2>{it ? "Servizi esterni" : "External services"}</h2>
          <p>
            {it
              ? "WhatsApp, i social e i servizi e-mail applicano le proprie informative. La mappa Google non viene caricata automaticamente: si attiva solo premendo “Carica la mappa”, con una connessione ai server del fornitore. TODO_CLIENTE: verificare destinatari, fornitori, log tecnici, eventuali trasferimenti internazionali e relative garanzie."
              : "WhatsApp, social platforms and email services apply their own privacy notices. Google Maps does not load automatically: selecting “Load the map” connects to the provider’s servers. TODO_CLIENTE: verify recipients, service providers, technical logs, any international transfers and relevant safeguards."}
          </p>
          <h2>{it ? "I tuoi diritti" : "Your rights"}</h2>
          <p>
            {it
              ? "Puoi contattare il titolare per esercitare i diritti applicabili, inclusi accesso, rettifica, cancellazione, limitazione, opposizione e portabilità, nei casi previsti. Puoi inoltre presentare un reclamo all’autorità di controllo competente."
              : "You can contact the controller to exercise applicable rights, including access, correction, erasure, restriction, objection and portability where relevant. You may also lodge a complaint with the competent supervisory authority."}{" "}
            <a
              href="https://www.garanteprivacy.it/"
              target="_blank"
              rel="noreferrer"
            >
              Garante per la protezione dei dati personali
            </a>
            .
          </p>
        </>
      ) : (
        <>
          <h2>{it ? "Preferenze essenziali" : "Essential preferences"}</h2>
          <p>
            {it
              ? "Il sito utilizza NEXT_LOCALE per ricordare la lingua scelta (durata massima: un anno). La sessionStorage del browser registra mx-visited e mx-language-transition per gestire l’introduzione e il cambio di lingua; viene eliminata alla fine della sessione della scheda."
              : "The site uses NEXT_LOCALE to remember your language choice (maximum duration: one year). Browser sessionStorage stores mx-visited and mx-language-transition for the intro and language transition; these are cleared at the end of the tab session."}
          </p>
          <h2>
            {it ? "Statistiche e pubblicità" : "Analytics and advertising"}
          </h2>
          <p>
            {it
              ? "Questa versione non integra strumenti di analytics o pubblicità. Nessun cookie non essenziale viene impostato dal sito. L’aggiunta futura di servizi di tracciamento richiederà una nuova valutazione e l’eventuale gestione del consenso prima del caricamento."
              : "This version does not include analytics or advertising tools. The site does not set non-essential cookies. Adding tracking services in the future requires a new assessment and, where applicable, consent before loading them."}
          </p>
          <h2>{it ? "Mappa e link esterni" : "Map and external links"}</h2>
          <p>
            {it
              ? "Il contenuto Google Maps è disattivato inizialmente. Premendo il pulsante di caricamento viene aperta una connessione al servizio esterno. I link WhatsApp, Instagram, Facebook e Ultracross aprono siti con proprie politiche."
              : "Google Maps content is initially disabled. Loading the map creates a connection to the external service. WhatsApp, Instagram, Facebook and Ultracross links open websites with their own policies."}{" "}
            TODO_CLIENTE:{" "}
            {it
              ? "verificare la configurazione effettiva di hosting e servizi prima del lancio."
              : "verify the actual hosting and service configuration before launch."}
          </p>
          <h2>{it ? "Gestire le preferenze" : "Managing preferences"}</h2>
          <p>
            {it
              ? "Puoi cambiare lingua dal selettore IT/EN e rimuovere cookie e dati locali dalle impostazioni del browser. Per domande:"
              : "You can change language using IT/EN and remove cookies and local data in your browser settings. For questions:"}{" "}
            <a href={`mailto:${site.contacts.email}`}>{site.contacts.email}</a>.
          </p>
        </>
      )}
      <h2>{it ? "Informazioni ufficiali" : "Official information"}</h2>
      <p>
        <a
          href="https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en"
          target="_blank"
          rel="noreferrer"
        >
          {it
            ? "Commissione europea: protezione dei dati personali"
            : "European Commission: personal data protection"}
        </a>
      </p>
      <p>
        {it ? "Ultima revisione e approvazione" : "Last review and approval"}:
        TODO_CLIENTE.
      </p>
    </main>
  );
}
