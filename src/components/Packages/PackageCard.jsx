import { formatINR } from "../../data/packages";

export default function PackageCard({ id, name, price, duration, features = [], highlight, onBook, cta }) {
  return (
    <div className={`group relative flex flex-col transition-all duration-500 bg-white border border-primary/5 hover:border-accent/30 p-8 ${highlight ? 'ring-1 ring-accent/20' : ''}`}>
      {highlight && (
        <div className="absolute -top-3 left-8 rounded-full bg-accent px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
          Highlight
        </div>
      )}

      <div className="mb-8 flex justify-between items-start">
        <div>
          <h3 className="serif text-2xl font-semibold text-primary group-hover:text-accent transition-colors">{name}</h3>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">{duration}</p>
        </div>
        <div className="text-right">
          <span className="block serif text-2xl font-bold text-primary">{formatINR(price)}</span>
          <span className="text-[10px] uppercase tracking-widest text-primary/40">/ Guest</span>
        </div>
      </div>

      <div className="grow">
        <ul className="space-y-4 text-[13px] text-primary/70 font-light leading-snug">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-4">
              <span className="h-px w-4 bg-accent/30" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <button
          onClick={() => onBook?.({ id, name })}
          className="w-full flex items-center justify-center gap-3 border border-primary/10 py-4 transition-all hover:bg-primary hover:text-white"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Inquire Now</span>
          <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}
