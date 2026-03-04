import { useEffect, useState, useMemo } from 'react';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

export default function CustomPackageSection() {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState('');
  const [startSearch, setStartSearch] = useState('');
  const [endSearch, setEndSearch] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [middle, setMiddle] = useState([]);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api('/api/packages/places')
      .then(setPlaces)
      .catch(console.error);
  }, []);

  const handleBook = () => {
    const query = new URLSearchParams();
    query.set('type', 'custom');
    if (start) query.set('start', start);
    if (end) query.set('end', end);
    if (middle.length > 0) query.set('middle', middle.map(m => m.id).join(','));
    navigate(`/book?${query.toString()}`);
  };

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newMiddle = [...middle];
    const itemToMove = newMiddle[draggedItemIndex];
    newMiddle.splice(draggedItemIndex, 1);
    newMiddle.splice(index, 0, itemToMove);
    
    setDraggedItemIndex(index);
    setMiddle(newMiddle);
  };

  const selectedStart = useMemo(() => places.find(p => p.id === Number(start)), [places, start]);
  const selectedEnd = useMemo(() => places.find(p => p.id === Number(end)), [places, end]);

  const filteredStartPlaces = useMemo(() => {
    if (!startSearch) return places;
    const term = startSearch.toLowerCase();
    return places.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.district.toLowerCase().includes(term)
    );
  }, [places, startSearch]);

  const filteredEndPlaces = useMemo(() => {
    if (!endSearch) return places;
    const term = endSearch.toLowerCase();
    return places.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.district.toLowerCase().includes(term)
    );
  }, [places, endSearch]);

  const filteredPlaces = useMemo(() => {
    if (!search) return places;
    const term = search.toLowerCase();
    return places.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.district.toLowerCase().includes(term)
    );
  }, [places, search]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/80 mb-4 block">Bespoke Journeys</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">Craft Your <span className="italic">Own</span> Route</h2>
          <p className="text-primary/60">Select your starting point, your final destination, and all the magical places you wish to visit along the way.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Builder */}
          <div className="lg:col-span-7 bg-sand/50 rounded-3xl p-8 border border-primary/5">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">1. Starting Point</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search departure location..."
                    value={startSearch || (selectedStart ? selectedStart.name : '')}
                    onFocus={() => {
                        setShowStartDropdown(true);
                        setStartSearch('');
                    }}
                    onChange={(e) => {
                      setStartSearch(e.target.value);
                      setShowStartDropdown(true);
                    }}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 transition-colors"
                  />
                  {showStartDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-primary/10 rounded-xl shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredStartPlaces.length > 0 ? (
                        filteredStartPlaces.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => {
                              setStart(p.id.toString());
                              setStartSearch(p.name);
                              setShowStartDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-primary/5 cursor-pointer text-sm"
                          >
                            {p.name} <span className="text-[10px] text-primary/40 ml-2">({p.district})</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-[10px] text-primary/40 uppercase">No locations found</div>
                      )}
                    </div>
                  )}
                  {showStartDropdown && <div className="fixed inset-0 z-10" onClick={() => setShowStartDropdown(false)} />}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">2. Final Destination</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search your destination..."
                    value={endSearch || (selectedEnd ? selectedEnd.name : '')}
                    onFocus={() => {
                        setShowEndDropdown(true);
                        setEndSearch('');
                    }}
                    onChange={(e) => {
                      setEndSearch(e.target.value);
                      setShowEndDropdown(true);
                    }}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 transition-colors"
                  />
                  {showEndDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-primary/10 rounded-xl shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredEndPlaces.length > 0 ? (
                        filteredEndPlaces.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => {
                              setEnd(p.id.toString());
                              setEndSearch(p.name);
                              setShowEndDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-primary/5 cursor-pointer text-sm"
                          >
                            {p.name} <span className="text-[10px] text-primary/40 ml-2">({p.district})</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-[10px] text-primary/40 uppercase">No locations found</div>
                      )}
                    </div>
                  )}
                  {showEndDropdown && <div className="fixed inset-0 z-10" onClick={() => setShowEndDropdown(false)} />}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">3. Places to Visit in Between</label>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search places or districts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                  {filteredPlaces.filter(p => p.id !== Number(start) && p.id !== Number(end)).map(place => {
                    const isSelected = middle.some(m => m.id === place.id);
                    return (
                      <label 
                        key={place.id} 
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-primary/5 border-primary/20' : 'bg-white border-primary/5 hover:border-primary/10'}`}
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
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-5 bg-primary rounded-3xl p-8 text-white relative overflow-hidden">
            <h3 className="font-serif text-2xl mb-8 relative z-10">Your Itinerary</h3>
            
            <div className="relative z-10">
              {(!selectedStart && middle.length === 0 && !selectedEnd) ? (
                <div className="text-white/50 text-center py-12 text-sm italic">
                  Start building your route to see the itinerary here...
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-white/10">
                  {selectedStart && (
                    <div className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-accent flex-shrink-0 border-4 border-primary z-10"></div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/50">Start</p>
                        <p className="text-lg">{selectedStart.name}</p>
                        <p className="text-xs text-white/50">{selectedStart.district}</p>
                      </div>
                    </div>
                  )}

                  {middle.map((m, idx) => (
                    <div 
                      key={m.id} 
                      className={`flex gap-4 relative cursor-move group/item transition-all ${draggedItemIndex === idx ? 'opacity-40 scale-95' : 'opacity-100'}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={() => setDraggedItemIndex(null)}
                    >
                      <div className="w-6 h-6 rounded-full bg-white/20 flex-shrink-0 border-4 border-primary z-10 group-hover/item:border-accent/40 transition-colors"></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/50">Stop {idx + 1}</p>
                            <p className="text-base group-hover/item:text-accent transition-colors">{m.name}</p>
                          </div>
                          <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Ref: M4 8h16M4 16h16" />
                             </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedEnd && (
                    <div className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-accent flex-shrink-0 border-4 border-primary z-10"></div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/50">Destination</p>
                        <p className="text-lg">{selectedEnd.name}</p>
                        <p className="text-xs text-white/50">{selectedEnd.district}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
              <button 
                onClick={handleBook}
                disabled={!start && !end && middle.length === 0}
                className="w-full py-4 bg-white text-primary font-bold uppercase tracking-widest text-xs rounded-full hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Book Route
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
