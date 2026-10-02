import { useRef, useState } from "react";
import { toast } from "sonner";
import { BedDouble, CalendarSearch, Cat, Flame, KeyRound, LogIn, LogOut, Send, Sprout } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const TOTAL_ROOMS = 38;
const ref = () => "HJ-" + Math.random().toString(36).slice(2, 7).toUpperCase();

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
        <Sprout className="h-4 w-4" />
      </div>
      <p className="rounded-lg rounded-tl-sm border border-border/70 bg-secondary/70 px-4 py-3 text-sm leading-relaxed text-foreground">{children}</p>
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

type Action = "book" | "manage" | "in" | "out" | "sauna" | "kjell";

const actionCopy: Record<Action, string> = {
  book: "Absolut. Välj datum och antal gäster här nedanför, så ser jag efter vad som är ledigt.",
  manage: "Jag hjälper dig. Ta fram bokningsreferensen så hittar vi vistelsen tillsammans.",
  in: "Välkommen! Skriv in ditt rumsnummer nedan så aktiverar jag din digitala nyckel.",
  out: "Jag ordnar utcheckningen. Ange rumsnumret, så avslutar vi vistelsen smidigt.",
  sauna: "En varm bastu låter precis rätt. Jag tar dig till kvällens lediga tider.",
  kjell: "Kjell är hotellets rödrandiga värd. Just nu ligger han troligen i fåtöljen vid brasan och övervakar lobbyn.",
};

const quickActions: { key: Action; label: string; icon: typeof BedDouble }[] = [
  { key: "book", label: "Boka rum", icon: BedDouble },
  { key: "manage", label: "Avboka / Hantera bokning", icon: CalendarSearch },
  { key: "in", label: "Checka in", icon: LogIn },
  { key: "out", label: "Checka ut", icon: LogOut },
  { key: "sauna", label: "Boka bastu", icon: Flame },
  { key: "kjell", label: "Fråga om Kjell", icon: Cat },
];

export function HildurWidget() {
  const [tab, setTab] = useState("book");
  const [message, setMessage] = useState("Hej! Jag är Hildur. Jag tar hand om det praktiska, så att Birgitta kan lägga all sin tid på varm fjällgästfrihet. Vad kan jag hjälpa dig med?");
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const act = (action: Action) => {
    setMessage(actionCopy[action]);
    if (action === "book" || action === "manage") setTab(action);
    if (action === "in" || action === "out") setTab("check");
    if (action === "sauna") {
      window.setTimeout(() => document.querySelector("[data-service='sauna']")?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    }
    inputRef.current?.focus();
  };

  const submitPrompt = () => {
    const text = prompt.trim().toLowerCase();
    if (!text) return;
    setPrompt("");
    if (text.includes("bastu")) return act("sauna");
    if (text.includes("kjell") || text.includes("katt")) return act("kjell");
    if (text.includes("avbok") || text.includes("ändra") || text.includes("referens")) return act("manage");
    if (text.includes("checka in") || text.includes("incheck")) return act("in");
    if (text.includes("checka ut") || text.includes("utcheck")) return act("out");
    if (text.includes("rum") || text.includes("boka") || text.includes("ledig")) return act("book");
    setMessage("Det tar jag gärna vidare. Välj en av genvägarna, eller fråga om rum, bokningar, incheckning, bastu eller Kjell.");
    inputRef.current?.focus();
  };

  return (
    <div className="rounded-lg border border-primary/20 bg-card/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <p className="eyebrow">Digital receptionist</p>
          <h2 className="text-2xl font-semibold">Hildur 4.0</h2>
        </div>
        <span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" /> I tjänst dygnet runt</span>
      </div>
      <div key={message} className="reply-in mb-4"><Bubble>{message}</Bubble></div>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {quickActions.map(({ key, label, icon: Icon }) => (
          <Button key={key} variant="outline" size="sm" className="h-auto min-h-10 justify-start whitespace-normal border-border/80 bg-background/30 px-3 py-2 text-left text-xs hover:border-primary/50 hover:bg-primary/10" onClick={() => act(key)}>
            <Icon className="h-3.5 w-3.5 shrink-0 text-primary" /> {label}
          </Button>
        ))}
      </div>
      <form className="mb-6 flex gap-2" onSubmit={(event) => { event.preventDefault(); submitPrompt(); }}>
        <input ref={inputRef} className="field" aria-label="Fråga Hildur" placeholder="Skriv till Hildur…" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        <Button type="submit" size="icon" aria-label="Skicka till Hildur"><Send className="h-4 w-4" /></Button>
      </form>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-5 grid w-full grid-cols-3 bg-background/40">
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
