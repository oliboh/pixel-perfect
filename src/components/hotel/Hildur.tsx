import { useState } from "react";
import { toast } from "sonner";
import { BedDouble, CalendarSearch, KeyRound, LogIn, LogOut, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const TOTAL_ROOMS = 38;
const ref = () => "HJ-" + Math.random().toString(36).slice(2, 7).toUpperCase();

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine text-pine-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <p className="rounded-2xl rounded-tl-sm bg-sand px-4 py-3 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function Booking() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(2);
  const [free, setFree] = useState<number | null>(null);

  const check = () => {
    if (!from || !to || to <= from) return void toast.error("Välj giltiga datum, kära gäst.");
    setFree(Math.max(2, (from.charCodeAt(9) * 7 + guests) % TOTAL_ROOMS));
  };
  const book = () => {
    toast.success(`Bokat! Din referens är ${ref()}`, {
      description: "Kjell har redan lagt sig på kudden och provsover den åt dig.",
    });
    setFree(null);
  };

  return (
    <div className="space-y-4">
      <Bubble>Välkommen upp till fjället! Berätta när du vill komma, så tittar jag i liggaren.</Bubble>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5"><Label>Ankomst</Label><input type="date" className="field" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div className="space-y-1.5"><Label>Avresa</Label><input type="date" className="field" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div className="space-y-1.5"><Label>Gäster</Label>
          <select className="field" value={guests} onChange={(e) => setGuests(+e.target.value)}>
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "gäst" : "gäster"}</option>)}
          </select>
        </div>
      </div>
      <Button onClick={check} className="w-full sm:w-auto"><CalendarSearch /> Kontrollera tillgänglighet</Button>
      {free !== null && (
        <div className="flex flex-col gap-3 rounded-xl border border-cloudberry/40 bg-cloudberry-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm"><strong>{free} av {TOTAL_ROOMS} rum</strong> är lediga för {guests} {guests === 1 ? "gäst" : "gäster"}. Så fint!</p>
          <Button variant="outline" onClick={book}><BedDouble /> Boka rum</Button>
        </div>
      )}
    </div>
  );
}

function Manage() {
  const [code, setCode] = useState("");
  const [found, setFound] = useState(false);
  return (
    <div className="space-y-4">
      <Bubble>Har planerna ändrats? Ingen fara alls. Skriv in din bokningsreferens så hjälper jag dig.</Bubble>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input className="field" placeholder="t.ex. HJ-7K2QX" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <Button onClick={() => (code.length < 4 ? toast.error("Referensen verkar för kort.") : setFound(true))}>Hämta bokning</Button>
      </div>
      {found && (
        <div className="space-y-3 rounded-xl border bg-card p-4 text-sm">
          <p><strong>{code}</strong> · Rum 14, Fjällutsikt · 2 gäster · 3 nätter</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Ändringsförfrågan skickad till Birgitta.")}>Ändra datum</Button>
            <Button variant="destructive" size="sm" onClick={() => { toast.success("Bokningen är avbokad.", { description: "Vi hoppas få se dig en annan gång." }); setFound(false); setCode(""); }}>Avboka</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckInOut() {
  const [room, setRoom] = useState("");
  const [status, setStatus] = useState<"none" | "in" | "out">("none");
  return (
    <div className="space-y-4">
      <Bubble>Smidigt och utan kö. Ange ditt rumsnummer så ordnar jag resten.</Bubble>
      <input className="field" placeholder="Rumsnummer (1–38)" value={room} onChange={(e) => setRoom(e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={() => { const n = +room; if (!n || n > 38) return void toast.error("Rumsnumret finns inte hos oss."); setStatus("in"); toast.success(`Incheckad i rum ${n}!`, { description: "Din digitala nyckel är aktiverad." }); }}><LogIn /> Checka in</Button>
        <Button variant="outline" onClick={() => { const n = +room; if (!n || n > 38) return void toast.error("Rumsnumret finns inte hos oss."); setStatus("out"); toast.success("Utcheckad. Tack för besöket!", { description: "Kjell vinkar adjö med svansen." }); }}><LogOut /> Checka ut</Button>
      </div>
      {status === "in" && <p className="flex items-center gap-2 text-sm text-primary"><KeyRound className="h-4 w-4" /> Nyckelkod: <strong>{Math.floor(1000 + Math.random() * 9000)}</strong></p>}
    </div>
  );
}

export function HildurWidget() {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[0_20px_60px_-30px_oklch(0.36_0.05_160/0.35)] sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="eyebrow">AI-receptionist</p>
          <h2 className="text-2xl">Hildur 4.0</h2>
        </div>
        <span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-cloudberry" /> I tjänst dygnet runt</span>
      </div>
      <Tabs defaultValue="book">
        <TabsList className="mb-5 grid w-full grid-cols-3">
          <TabsTrigger value="book">Boka</TabsTrigger>
          <TabsTrigger value="manage">Min bokning</TabsTrigger>
          <TabsTrigger value="check">In/utcheckning</TabsTrigger>
        </TabsList>
        <TabsContent value="book"><Booking /></TabsContent>
        <TabsContent value="manage"><Manage /></TabsContent>
        <TabsContent value="check"><CheckInOut /></TabsContent>
      </Tabs>
    </div>
  );
}
