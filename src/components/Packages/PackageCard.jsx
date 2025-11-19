import { formatINR } from "../../data/packages";

export default function PackageCard({ id, name, price, duration, features = [], highlight, onBook, cta }) {
  return (
    <div className={`flex flex-col rounded-2xl border ${highlight ? 'border-emerald-600 shadow-lg shadow-emerald-100' : 'border-slate-200 shadow-sm'} bg-white p-6`}>
      {highlight && (
        <div className="mb-3 inline-block self-start rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </div>
      )}

      <h3 className="text-xl font-semibold text-slate-900">{name}</h3>
      <p className="mt-1 text-sm text-slate-600">{duration}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-emerald-700">{formatINR(price)}</span>
        <span className="text-sm text-slate-500">per person</span>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-slate-700">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {onBook ? (
        <button
          type="button"
          onClick={() => onBook({ id, name })}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Book this package
        </button>
      ) : (
        <a
          href={cta}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Book this package
        </a>
      )}
    </div>
  );
}
