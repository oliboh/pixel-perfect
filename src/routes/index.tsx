import { createFileRoute } from "@tanstack/react-router";
import { Cat, Lock, MapPin, Mountain, ServerCog, ShieldCheck, Trash2, UserCheck } from "lucide-react";
import { HildurWidget } from "@/components/hotel/Hildur";
import { Services } from "@/components/hotel/Services";

const TITLE = "Fjällhotell Hjortronet – Boutiquehotell i Hemavan";
const DESC = "Ett mysigt fjällhotell med 38 rum i Hemavan. Boka rum, bastu, frukost och norrskenstur med vår AI-receptionist Hildur 4.0.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

const pledges = [
  { icon: Lock, t: "Krypterat från dörr till dörr", d: "Allt du skriver till mig skickas krypterat och lagras säkert inom EU." },
  { icon: UserCheck, t: "Bara det vi behöver", d: "Vi frågar endast efter uppgifter som krävs för din vistelse. Inget mer." },
  { icon: Trash2, t: "Raderas i tid", d: "Personuppgifter tas bort när de inte längre behövs, enligt GDPR." },
  { icon: ServerCog, t: "Låsta system", d: "Hotellets system uppdateras, övervakas och skyddas med flerstegsinloggning." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2">
          <Mountain className="h-5 w-5 text-primary" />
          <span className="font-display text-lg">Hjortronet</span>
        </div>
        <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#tjanster" className="hover:text-foreground">Gästservice</a>
          <a href="#trygghet" className="hover:text-foreground">Trygghet</a>
          <a href="#om" className="hover:text-foreground">Om oss</a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:pt-16">
        <div>
          <p className="eyebrow mb-4">Hemavan · Södra Lappland</p>
          <h1 className="text-5xl leading-[1.05] sm:text-6xl">Fjällhotell <span className="italic text-cloudberry">Hjortronet</span></h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Trettioåtta rum, en sprakande bastu och fjället utanför fönstret. Här tar vi emot dig med varm fjällgästfrihet – och en katt som heter Kjell.
          </p>
          <div className="mt-8 flex gap-8 border-t pt-6 text-sm">
            <div><p className="font-display text-2xl">38</p><p className="text-muted-foreground">rum</p></div>
            <div><p className="font-display text-2xl">560</p><p className="text-muted-foreground">m ö.h.</p></div>
            <div><p className="font-display text-2xl">1</p><p className="text-muted-foreground">hotellkatt</p></div>
          </div>
        </div>
        <HildurWidget />
      </section>

      <section id="tjanster" className="border-y bg-sand/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow mb-3">Under vistelsen</p>
          <h2 className="mb-10 text-4xl">Gästservice</h2>
          <Services />
        </div>
      </section>

      <section id="trygghet" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <ShieldCheck className="mb-4 h-8 w-8 text-primary" />
            <p className="eyebrow mb-3">Hildurs Trygghetslöfte</p>
            <h2 className="text-4xl">Dina uppgifter är trygga hos oss</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Precis som Birgitta låser ytterdörren varje kväll, vaktar jag dina personuppgifter. Vi följer GDPR fullt ut och du kan när som helst be oss visa eller radera det vi sparat om dig.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pledges.map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-2xl border bg-card p-5">
                <I className="mb-3 h-5 w-5 text-cloudberry" />
                <h3 className="text-lg">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="om" className="bg-pine text-pine-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
          <div>
            <h3 className="text-2xl">Hjortronet</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-80">Drivs med kärlek av Birgitta Ljungqvist sedan 1989. Numera med lite hjälp av Hildur 4.0, som sköter datorerna så att Birgitta kan sköta gästerna.</p>
          </div>
          <div>
            <p className="flex items-center gap-2 font-semibold"><Cat className="h-4 w-4" /> Kjell</p>
            <p className="mt-3 text-sm leading-relaxed opacity-80">Hotellets rödrandiga katt. Finns oftast i fåtöljen vid brasan. Tar gärna emot klappar, aldrig mutor.</p>
          </div>
          <div>
            <p className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4" /> Hitta hit</p>
            <p className="mt-3 text-sm leading-relaxed opacity-80">Fjällvägen 12, 920 66 Hemavan<br />Reception: 0954-123 45<br />hej@hjortronet.se</p>
          </div>
        </div>
        <p className="border-t border-pine-foreground/15 py-5 text-center text-xs opacity-60">© 2026 Fjällhotell Hjortronet · Med varm fjällgästfrihet</p>
      </footer>
    </div>
  );
}
