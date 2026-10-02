import { useState } from "react";
import { toast } from "sonner";
import { Coffee, Flame, Moon, Wrench, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function Card({ icon: Icon, title, sub, children }: { icon: typeof Flame; title: string; sub: string; children: React.ReactNode }) {
  return (
    <article data-service={title === "Bastu" ? "sauna" : undefined} className="flex flex-col rounded-lg border border-border/80 bg-card p-6 transition-colors hover:border-primary/40">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-cloudberry-soft text-cloudberry"><Icon className="h-5 w-5" /></div>
        <div><h3 className="text-xl">{title}</h3><p className="text-xs text-muted-foreground">{sub}</p></div>
      </div>
      <div className="flex-1 space-y-4">{children}</div>
    </article>
  );
}

const MAX = 8;
function Sauna() {
  const [slots, setSlots] = useState<Record<string, number>>({ "16:00": 3, "17:30": 5, "19:00": 7, "20:30": 2 });
  const [mine, setMine] = useState<string | null>(null);
  const book = (t: string) => {
    if ((slots[t] ?? 0) >= MAX) return void toast.error("Den tiden är fullbokad.");
    setSlots((s) => ({ ...s, [t]: (s[t] ?? 0) + 1, ...(mine ? { [mine]: (s[mine] ?? 1) - 1 } : {}) }));
    setMine(t);
    toast.success(`Bastu bokad kl ${t}`, { description: "Handdukar ligger framme vid vedkorgen." });
  };
  return (
    <Card icon={Flame} title="Bastu" sub="Vedeldad, max 8 personer per pass">
      <ul className="space-y-2">
        {Object.entries(slots).map(([t, n]) => (
          <li key={t} className="flex items-center gap-3 rounded-lg border p-3">
            <span className="w-12 font-semibold">{t}</span>
            <div className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-cloudberry transition-all" style={{ width: `${(n / MAX) * 100}%` }} /></div>
              <p className="mt-1 text-xs text-muted-foreground">{n}/{MAX} platser tagna</p>
            </div>
            <Button size="sm" variant={mine === t ? "default" : "outline"} disabled={n >= MAX && mine !== t} onClick={() => mine !== t && book(t)}>
              {mine === t ? "Din tid" : n >= MAX ? "Fullt" : "Boka"}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Breakfast() {
  const [time, setTime] = useState("08:00");
  const [diet, setDiet] = useState("");
  return (
    <Card icon={Coffee} title="Frukost" sub="Hjortronsylt, nybakat & rökt röding">
      <div className="space-y-1.5"><Label>Sittning</Label>
        <div className="grid grid-cols-4 gap-2">
          {["07:00", "08:00", "09:00", "10:00"].map((t) => (
            <button key={t} onClick={() => setTime(t)} className={`rounded-lg border py-2 text-sm transition-colors ${time === t ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5"><Label>Specialkost / allergier</Label><Textarea value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="t.ex. glutenfritt, laktosfritt, nötallergi" /></div>
      <Button className="w-full" onClick={() => { toast.success(`Frukostbord reserverat kl ${time}`, { description: diet ? "Köket har noterat din specialkost." : "Välkommen till frukostmatsalen!" }); setDiet(""); }}>Reservera bord</Button>
    </Card>
  );
}

function Aurora() {
  const [date, setDate] = useState("");
  const [n, setN] = useState(2);
  const [left, setLeft] = useState(6);
  return (
    <Card icon={Moon} title="Norrskenstur" sub="Guidad kvällstur, 21:00–00:30 · 695 kr/pers">
      <p className="text-sm leading-relaxed text-muted-foreground">Vi åker snöskoter upp mot kalfjället, bjuder på varm blåbärssoppa vid elden och väntar in himlens dans. Varma overaller ingår.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>Datum</Label><input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div className="space-y-1.5"><Label>Personer</Label><select className="field" value={n} onChange={(e) => setN(+e.target.value)}>{[1, 2, 3, 4].map((x) => <option key={x}>{x}</option>)}</select></div>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> {left} platser kvar ikväll</p>
      <Button className="w-full" onClick={() => { if (!date) return void toast.error("Välj ett datum först."); if (n > left) return void toast.error("Inte tillräckligt med platser."); setLeft(left - n); toast.success(`Norrskenstur bokad för ${n}`, { description: `Samling i lobbyn 20:45. Totalt ${n * 695} kr.` }); }}>Boka plats</Button>
    </Card>
  );
}

function Issue() {
  const [room, setRoom] = useState("");
  const [cat, setCat] = useState("Värme");
  const [desc, setDesc] = useState("");
  return (
    <Card icon={Wrench} title="Felanmälan" sub="Något som inte fungerar på rummet?">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>Rumsnummer</Label><input className="field" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="14" /></div>
        <div className="space-y-1.5"><Label>Kategori</Label><select className="field" value={cat} onChange={(e) => setCat(e.target.value)}>{["Värme", "VVS", "El & belysning", "Utrustning", "Städning", "Övrigt"].map((c) => <option key={c}>{c}</option>)}</select></div>
      </div>
      <div className="space-y-1.5"><Label>Beskrivning</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Beskriv kort vad som hänt" /></div>
      <Button className="w-full" variant="outline" onClick={() => { if (!room || !desc) return void toast.error("Fyll i rumsnummer och beskrivning."); toast.success(`Ärende registrerat för rum ${room}`, { description: "Vaktmästaren är på väg inom 30 minuter." }); setDesc(""); }}>Skicka felanmälan</Button>
    </Card>
  );
}

export function Services() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Sauna /><Breakfast /><Aurora /><Issue />
    </div>
  );
}
