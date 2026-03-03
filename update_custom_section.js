const fs = require('fs');

const path = 'src/components/Packages/CustomPackageSection.jsx';
let content = fs.readFileSync(path, 'utf8');

const updatedImports = content.replace(
  "const [middle, setMiddle] = useState([]);",
  `const [middle, setMiddle] = useState([]);
  const [districtFilter, setDistrictFilter] = useState('All');`
);

const updatedLogic = updatedImports.replace(
  "const selectedStart = useMemo(() => places.find(p => p.id === Number(start)), [places, start]);\n  const selectedEnd = useMemo(() => places.find(p => p.id === Number(end)), [places, end]);",
  `const selectedStart = useMemo(() => places.find(p => p.id === Number(start)), [places, start]);
  const selectedEnd = useMemo(() => places.find(p => p.id === Number(end)), [places, end]);

  const districts = useMemo(() => [...new Set(places.map(p => p.district))].filter(Boolean).sort(), [places]);

  const availablePlaces = places.filter(p => districtFilter === 'All' || p.district === districtFilter);

  const startOptions = [...availablePlaces];
  if (selectedStart && !startOptions.find(p => p.id === selectedStart.id)) {
    startOptions.unshift(selectedStart);
  }

  const endOptions = [...availablePlaces];
  if (selectedEnd && !endOptions.find(p => p.id === selectedEnd.id)) {
    endOptions.unshift(selectedEnd);
  }`
);

const newFormArea = `            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">Filter by District</label>
                <select 
                  value={districtFilter} 
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full bg-white border border-primary/20 rounded-xl px-4 py-3 outline-none focus:border-accent/50 transition-colors shadow-sm"
                >
                  <option value="All">All Districts (Kerala)</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">1. Starting Point</label>
                  <select 
                    value={start} 
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 transition-colors"
                  >
                    <option value="">Choose departure location...</option>
                    {startOptions.map(p => <option key={p.id} value={p.id}>{p.name} ({p.district})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">2. Final Destination</label>
                  <select 
                    value={end} 
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 transition-colors"
                  >
                    <option value="">Choose your destination...</option>
                    {endOptions.map(p => <option key={p.id} value={p.id}>{p.name} ({p.district})</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">3. Places to Visit in Between</label>
                <div className="grid sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                  {availablePlaces.filter(p => p.id !== Number(start) && p.id !== Number(end)).map(place => {
                    const isSelected = middle.some(m => m.id === place.id);
                    return (
                      <label 
                        key={place.id} 
                        className={\`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer \${isSelected ? 'bg-primary/5 border-primary/20' : 'bg-white border-primary/5 hover:border-primary/10'}\`}
                      >
                        <input 
                          type="checkbox" 
                          className="mt-1 accent-primary"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setMiddle([...middle, place]);
                            else setMiddle(middle.filter(m => m.id !== place.id));
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-primary">{place.name}</p>
                          <p className="text-[10px] text-primary/50 uppercase">{place.district}</p>
                        </div>
                      </label>
                    );
                  })}
                  {availablePlaces.filter(p => p.id !== Number(start) && p.id !== Number(end)).length === 0 && (
                    <p className="text-sm text-primary/50 italic py-4 col-span-full text-center">No additional places in this district.</p>
                  )}
                </div>
              </div>
            </div>`;

// Replace the old space-y-8 div with the newFormArea
const startIndex = updatedLogic.indexOf('<div className="space-y-8">');
const endIndexStr = '</div>\n          </div>\n\n          {/* Visualization */}';
const endIndex = updatedLogic.indexOf(endIndexStr);

const finalStr = updatedLogic.substring(0, startIndex) + newFormArea + "\n          " + updatedLogic.substring(endIndex);

fs.writeFileSync(path, finalStr);
console.log('Done replacing!');

