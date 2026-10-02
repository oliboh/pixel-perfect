import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BedDouble, CalendarSearch, Cat, Flame, KeyRound, LogIn, LogOut, Sprout } from "lucide-react";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { copy, useHotelPreferences } from "./HotelPreferences";

const TOTAL_ROOMS = 38;
const makeRef = () => "HJ-" + Math.random().toString(36).slice(2, 7).toUpperCase();
type Action = "book" | "manage" | "in" | "out" | "sauna" | "kjell";

function AssistantMessage({ children }: { children: string }) {
  return (
    <Message from="assistant" className="max-w-full">
      <div className="flex gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/25 bg-accent text-primary"><Sprout className="h-5 w-5" /></div>
        <MessageContent className="pt-1 text-base leading-7 sm:text-lg"><MessageResponse>{children}</MessageResponse></MessageContent>
      </div>
    </Message>
  );
}

function Booking({ senior }: { senior: boolean }) {
  const { language } = useHotelPreferences(); const c = copy[language];
  const [from, setFrom] = useState(""); const [to, setTo] = useState(""); const [guests, setGuests] = useState(2);
  const [free, setFree] = useState<number | null>(null); const [step, setStep] = useState(0);
  const check = () => {
    if (!from || !to || to <= from) return void toast.error(language === "en" ? "Choose valid dates." : "Välj giltiga datum.");
    setFree(Math.max(2, (from.charCodeAt(9) * 7 + guests) % TOTAL_ROOMS)); setStep(3);
  };
  const fields = [
    <div key="from" className="space-y-2"><Label>{c.arrival}</Label><input type="date" className="field" value={from} onChange={(e) => setFrom(e.target.value)} /></div>,
    <div key="to" className="space-y-2"><Label>{c.departure}</Label><input type="date" className="field" value={to} onChange={(e) => setTo(e.target.value)} /></div>,
    <div key="guests" className="space-y-2"><Label>{c.guests}</Label><select className="field" value={guests} onChange={(e) => setGuests(+e.target.value)}>{[1,2,3,4,5,6].map((n) => <option key={n}>{n}</option>)}</select></div>,
  ];
  return <div className="space-y-5">
    <AssistantMessage>{c.bookingHello}</AssistantMessage>
    {senior ? <div className="senior-step">{fields[step] ?? <p className="text-lg font-semibold">{free} / {TOTAL_ROOMS} {c.rooms}</p>}<div className="mt-5 flex gap-3">{step > 0 && <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>{c.back}</Button>}{step < 2 ? <Button size="lg" onClick={() => setStep(step + 1)}>{c.next}</Button> : step === 2 ? <Button size="lg" onClick={check}>{c.availability}</Button> : <Button size="lg" onClick={() => toast.success(`${makeRef()}`)}>{c.book}</Button>}</div></div> : <><div className="grid gap-4 sm:grid-cols-3">{fields}</div><Button size="lg" onClick={check}><CalendarSearch />{c.availability}</Button>{free !== null && <div className="flex items-center justify-between gap-4 rounded-md border border-primary/25 bg-accent p-5"><strong>{free} / {TOTAL_ROOMS} {c.rooms}</strong><Button variant="outline" onClick={() => toast.success(`${makeRef()}`)}><BedDouble />{c.book}</Button></div>}</>}
  </div>;
}

function Manage() {
  const { language } = useHotelPreferences(); const c = copy[language]; const [code, setCode] = useState("");
  return <div className="space-y-5"><AssistantMessage>{c.manageHello}</AssistantMessage><Label>{c.reference}</Label><div className="flex flex-col gap-3 sm:flex-row"><input className="field" placeholder="HJ-7K2QX" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}/><Button size="lg" onClick={() => code.length < 4 ? toast.error(c.reference) : toast.success("Rum 14 · 3 nätter")}>{c.findBooking}</Button></div></div>;
}

function CheckInOut({ senior }: { senior: boolean }) {
  const { language } = useHotelPreferences(); const c = copy[language]; const [room, setRoom] = useState(""); const [key, setKey] = useState<number | null>(null); const [step, setStep] = useState(0);
  const validate = (inside: boolean) => { const n = +room; if (!n || n > 38) return void toast.error(c.roomNumber); if (inside) setKey(Math.floor(1000 + Math.random() * 9000)); toast.success(inside ? c.checkIn : c.checkOut); };
  return <div className="space-y-5"><AssistantMessage>{c.checkHello}</AssistantMessage><div className={senior ? "senior-step" : "space-y-4"}>{(!senior || step === 0) && <div className="space-y-2"><Label>{c.roomNumber}</Label><input className="field" inputMode="numeric" value={room} onChange={(e) => setRoom(e.target.value)}/></div>}{senior && step === 0 ? <Button size="lg" className="mt-5" onClick={() => room ? setStep(1) : toast.error(c.roomNumber)}>{c.next}</Button> : <div className="grid gap-3 sm:grid-cols-2"><Button size="lg" onClick={() => validate(true)}><LogIn />{c.checkIn}</Button><Button size="lg" variant="outline" onClick={() => validate(false)}><LogOut />{c.checkOut}</Button></div>}</div>{key && <p className="flex items-center gap-2 text-lg font-semibold text-primary"><KeyRound />{key}</p>}</div>;
}

export function HildurWidget() {
  const { language, senior } = useHotelPreferences(); const c = copy[language];
  const [tab, setTab] = useState("book"); const [message, setMessage] = useState(c.greeting);
  useEffect(() => setMessage(senior ? c.seniorGreeting : c.greeting), [language, senior, c]);
  const responses: Record<Action, string> = { book: c.bookingHello, manage: c.manageHello, in: c.checkHello, out: c.checkHello, sauna: senior ? `${c.sauna}! ${c.seniorGreeting}` : c.saunaSub, kjell: language === "en" ? "Kjell is our ginger host. He is probably supervising the lobby armchair." : "Kjell är vår rödrandiga värd. Han övervakar gärna fåtöljen vid brasan." };
  const actions: { key: Action; icon: typeof BedDouble }[] = [{key:"book",icon:BedDouble},{key:"manage",icon:CalendarSearch},{key:"in",icon:LogIn},{key:"out",icon:LogOut},{key:"sauna",icon:Flame},{key:"kjell",icon:Cat}];
  const act = (action: Action) => { setMessage(responses[action]); if (["book","manage"].includes(action)) setTab(action); if (["in","out"].includes(action)) setTab("check"); if (action === "sauna") window.setTimeout(() => document.querySelector("[data-service='sauna']")?.scrollIntoView({behavior:"smooth",block:"center"}),100); };
  const submit = (text: string) => { const q = text.toLowerCase(); if (q.includes("bast") || q.includes("sauna")) act("sauna"); else if (q.includes("kjell") || q.includes("cat") || q.includes("katt")) act("kjell"); else if (q.includes("check") || q.includes("kirj")) act(q.includes("out") || q.includes("ut") || q.includes("ulos") ? "out" : "in"); else if (q.includes("manage") || q.includes("avbok") || q.includes("håndter") || q.includes("booking")) act("manage"); else act("book"); };
  return <section aria-label="Hildur 4.0" className="hildur-console">
    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-8"><div><p className="eyebrow">{c.hildurLabel}</p><h2 className="mt-1 font-serif text-3xl font-semibold">Hildur 4.0</h2></div><span className="flex items-center gap-2 text-sm text-muted-foreground"><span className="h-2.5 w-2.5 rounded-full bg-primary"/>{c.online}</span></div>
    <div className="p-6 sm:p-8"><Conversation className="min-h-28"><ConversationContent className="p-0"><AssistantMessage>{message}</AssistantMessage></ConversationContent></Conversation>
      <div className={`my-6 grid gap-3 ${senior ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>{actions.map(({key,icon:Icon},i) => <Button key={key} variant="outline" size="lg" className="h-auto min-h-14 justify-start whitespace-normal px-4 py-3 text-left" onClick={() => act(key)}><Icon className="text-primary"/>{c.actions[i]}</Button>)}</div>
      {!senior && <PromptInput className="border-border bg-background" onSubmit={({text}) => submit(text)}><PromptInputTextarea aria-label={c.ask} placeholder={c.ask} className="min-h-20 text-base"/><PromptInputFooter className="justify-end"><PromptInputSubmit aria-label={c.send} className="h-11 w-11"/></PromptInputFooter></PromptInput>}
      <Tabs value={tab} onValueChange={setTab} className="mt-7"><TabsList className="grid h-auto w-full grid-cols-3 bg-muted p-1">{["book","manage","check"].map((v,i) => <TabsTrigger key={v} value={v} className="min-h-11 whitespace-normal px-2">{c.tabs[i]}</TabsTrigger>)}</TabsList><TabsContent value="book" className="mt-6"><Booking senior={senior}/></TabsContent><TabsContent value="manage" className="mt-6"><Manage/></TabsContent><TabsContent value="check" className="mt-6"><CheckInOut senior={senior}/></TabsContent></Tabs>
    </div>
  </section>;
}