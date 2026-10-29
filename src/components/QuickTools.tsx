import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Calculator, ShieldCheck, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/Reveal";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const short = (n: number) => n >= 1e7 ? `₹${(n / 1e7).toFixed(1)}Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)}L` : inr(n);

function Field({ label, value, display, min, max, step, onChange }: { label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return <div className="space-y-3">
    <div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-foreground">{label}</span><span className="rounded-lg bg-secondary px-2.5 py-1 font-semibold text-primary">{display}</span></div>
    <Slider aria-label={label} value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v ?? min)} />
  </div>;
}

function Result({ items }: { items: [string, string, boolean?][] }) {
  return <div className="grid gap-3 sm:grid-cols-3">{items.map(([l, v, hi]) => <div key={l} className={`rounded-xl p-4 ${hi ? "brand-gradient text-primary-foreground" : "bg-secondary"}`}><p className={`text-xs ${hi ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{l}</p><p className="mt-1 font-display text-xl font-bold">{v}</p></div>)}</div>;
}

const tip = { contentStyle: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" } };

function Sip() {
  const [amt, setAmt] = useState(10000); const [rate, setRate] = useState(12); const [yrs, setYrs] = useState(15);
  const data = useMemo(() => { const r = rate / 1200; return Array.from({ length: yrs }, (_, i) => { const n = (i + 1) * 12; return { year: `Y${i + 1}`, invested: amt * n, value: amt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) }; }); }, [amt, rate, yrs]);
  const last = data[data.length - 1]!;
  return <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
    <div className="space-y-7">
      <Field label="Monthly investment" value={amt} display={inr(amt)} min={500} max={100000} step={500} onChange={setAmt} />
      <Field label="Expected return (p.a.)" value={rate} display={`${rate}%`} min={4} max={20} step={0.5} onChange={setRate} />
      <Field label="Time period" value={yrs} display={`${yrs} yrs`} min={1} max={40} step={1} onChange={setYrs} />
    </div>
    <div className="space-y-5">
      <Result items={[["Invested", short(last.invested)], ["Est. returns", short(last.value - last.invested)], ["Total value", short(last.value), true]]} />
      <div className="h-52"><ResponsiveContainer><AreaChart data={data}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="year" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} /><YAxis tickFormatter={short} width={60} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} /><Tooltip formatter={(v: number) => inr(v)} {...tip} /><Area type="monotone" dataKey="value" name="Value" stroke="var(--primary)" fill="url(#g)" strokeWidth={2} /><Area type="monotone" dataKey="invested" name="Invested" stroke="var(--accent)" fill="transparent" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
    </div>
  </div>;
}

function slab(income: number, slabs: [number, number][]) { let tax = 0, prev = 0; for (const [limit, rate] of slabs) { if (income > prev) tax += (Math.min(income, limit) - prev) * rate; prev = limit; } return tax; }

function Tax() {
  const [income, setIncome] = useState(1500000); const [ded, setDed] = useState(200000);
  const newTaxable = Math.max(0, income - 75000); const oldTaxable = Math.max(0, income - 50000 - ded);
  let nt = slab(newTaxable, [[400000, 0], [800000, .05], [1200000, .1], [1600000, .15], [2000000, .2], [2400000, .25], [Infinity, .3]]); if (newTaxable <= 1200000) nt = 0;
  let ot = slab(oldTaxable, [[250000, 0], [500000, .05], [1000000, .2], [Infinity, .3]]); if (oldTaxable <= 500000) ot = 0;
  nt *= 1.04; ot *= 1.04;
  const better = nt <= ot ? "New regime" : "Old regime";
  return <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
    <div className="space-y-7">
      <Field label="Annual gross income" value={income} display={inr(income)} min={300000} max={5000000} step={50000} onChange={setIncome} />
      <Field label="Deductions (80C, 80D, HRA, home loan…)" value={ded} display={inr(ded)} min={0} max={800000} step={10000} onChange={setDed} />
      <p className="text-xs leading-relaxed text-muted-foreground">Rough estimate for salaried individuals (FY 2025-26 slabs, incl. 4% cess, standard deduction). Excludes surcharge and marginal relief — speak with us for an exact computation.</p>
    </div>
    <div className="space-y-5">
      <Result items={[["Old regime tax", inr(ot)], ["New regime tax", inr(nt)], [`${better} saves`, inr(Math.abs(ot - nt)), true]]} />
      <div className="h-52"><ResponsiveContainer><BarChart data={[{ name: "Old regime", tax: ot }, { name: "New regime", tax: nt }]}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} /><YAxis tickFormatter={short} width={60} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} /><Tooltip formatter={(v: number) => inr(v)} {...tip} /><Bar dataKey="tax" name="Tax" fill="var(--primary)" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div>
    </div>
  </div>;
}

function Cover() {
  const [income, setIncome] = useState(800000); const [age, setAge] = useState(35); const [loans, setLoans] = useState(1000000); const [existing, setExisting] = useState(2500000);
  const years = Math.max(0, 60 - age); const hlv = income * 0.7 * Math.min(years, 25); const need = Math.max(0, hlv + loans - existing);
  return <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
    <div className="space-y-6">
      <Field label="Annual income" value={income} display={inr(income)} min={200000} max={5000000} step={50000} onChange={setIncome} />
      <Field label="Your age" value={age} display={`${age} yrs`} min={18} max={59} step={1} onChange={setAge} />
      <Field label="Outstanding loans" value={loans} display={inr(loans)} min={0} max={10000000} step={100000} onChange={setLoans} />
      <Field label="Existing life cover" value={existing} display={inr(existing)} min={0} max={20000000} step={100000} onChange={setExisting} />
    </div>
    <div className="space-y-5">
      <Result items={[["Income replacement", short(hlv)], ["Plus loans", short(loans)], ["Suggested extra cover", short(need), true]]} />
      <div className="h-52"><ResponsiveContainer><BarChart layout="vertical" data={[{ n: "Needed", v: hlv + loans }, { n: "Existing", v: existing }, { n: "Gap", v: need }]}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis type="number" tickFormatter={short} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} /><YAxis type="category" dataKey="n" width={70} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} /><Tooltip formatter={(v: number) => inr(v)} {...tip} /><Bar dataKey="v" name="Amount" fill="var(--primary)" radius={[0, 10, 10, 0]} /></BarChart></ResponsiveContainer></div>
      <p className="text-xs text-muted-foreground">Human life value method: 70% of income replaced until age 60 (max 25 years). Indicative only.</p>
    </div>
  </div>;
}

export function QuickTools() {
  return <section id="calculators" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8">
    <Reveal><p className="text-xs font-bold uppercase tracking-wider text-primary">Quick tools</p><h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Run the numbers in seconds.</h2></Reveal>
    <Reveal delay={0.1} className="glass-panel mt-8 rounded-3xl border border-card/80 p-5 sm:p-8">
      <Tabs defaultValue="sip">
        <TabsList className="mb-8 grid h-auto w-full grid-cols-3 rounded-xl p-1 sm:w-auto sm:inline-grid">
          <TabsTrigger value="sip" className="gap-1.5 rounded-lg py-2"><TrendingUp size={15} /> SIP</TabsTrigger>
          <TabsTrigger value="tax" className="gap-1.5 rounded-lg py-2"><Calculator size={15} /> Tax regime</TabsTrigger>
          <TabsTrigger value="cover" className="gap-1.5 rounded-lg py-2"><ShieldCheck size={15} /> Life cover</TabsTrigger>
        </TabsList>
        <TabsContent value="sip"><Sip /></TabsContent>
        <TabsContent value="tax"><Tax /></TabsContent>
        <TabsContent value="cover"><Cover /></TabsContent>
      </Tabs>
    </Reveal>
  </section>;
}
