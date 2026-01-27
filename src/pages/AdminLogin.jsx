import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const Dashboard = ({ stats, recentBookings, enquiries, setView }) => {
    const unread = enquiries.filter(e => !e.is_read && !e.is_archived).slice(0, 3);
    
    const cards = [
        { label: 'Revenue', value: `INR ${(stats.revenue || 0).toLocaleString()}`, color: 'text-emerald-600' },
        { label: 'Total Travelers', value: (stats.travelers || 0).toLocaleString(), color: 'text-blue-600' },
        { label: 'Total Bookings', value: (stats.bookings || 0).toLocaleString(), color: 'text-indigo-600' },
        { label: 'Pending Enquiries', value: (stats.enquiries || 0).toLocaleString(), color: 'text-amber-600' },
    ];

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">System status and key metrics for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold">System Online</span>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{card.label}</p>
                        <p className={`text-3xl font-bold ${card.color || 'text-slate-900'}`}>
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-900">Recent Bookings</h2>
                        <span className="text-xs font-semibold text-slate-400">Latest 10 entries</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Traveler</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Package</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentBookings.map(b => (
                                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-900">{b.applicant_name}</div>
                                            <div className="md:hidden text-xs text-slate-500">{b.package_name}</div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-sm text-slate-600">{b.package_name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(b.package_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-900">Recent Enquiries</h2>
                    </div>
                    <div className="p-6 space-y-6 flex-1">
                        {unread.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                <p className="text-sm font-medium">No unread enquiries</p>
                            </div>
                        ) : (
                            <>
                                {unread.map(e => (
                                    <div key={e.id} className="border-b border-slate-100 pb-4 last:border-0 group">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs font-bold text-blue-600 uppercase">{e.name}</p>
                                            <span className="text-[10px] font-medium text-slate-400 uppercase">{new Date(e.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">"{e.message}"</p>
                                        <button 
                                            onClick={() => setView('enquiries')}
                                            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1.5 border border-slate-200 bg-slate-50"
                                        >
                                            <span>Open Correspondence</span>
                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                {enquiries.length > unread.length && (
                                    <button 
                                        onClick={() => setView('enquiries')}
                                        className="w-full text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors py-3 bg-slate-50 border border-slate-200 rounded-lg"
                                    >
                                        View All Enquiries ({enquiries.length})
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TravelerList = ({ users, onRefresh, isLoading }) => {
    const deleteUser = async (id) => {
        if (!confirm('Permanently remove this traveler and all associated data?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) throw new Error('Authentication required. Please log in again.');
            await api(`/api/admin/users/${id}`, { 
                method: 'DELETE', 
                token
            });
            onRefresh();
        } catch (err) { 
            alert(err.message || 'Failed to delete traveler record.');
            console.error('[DELETE_USER_ERROR]', err);
        }
    };

    if (isLoading && users.length === 0) return (
        <div className="text-center py-20 text-slate-400">
            <div className="h-8 w-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Accessing Traveler Records</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Traveler Records</h1>
                    <p className="text-sm text-slate-500 mt-1">Verified collective registry containing {users.length} travelers</p>
                </div>
                <button onClick={onRefresh} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Member Details</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Join Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="text-sm font-semibold text-slate-900">{u.name}</div>
                                        <div className="text-xs text-slate-500">{u.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${u.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${u.is_verified ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                            {u.is_verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(u.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => deleteUser(u.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete Traveler"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const EnquiriesView = ({ enquiries, onRefresh, isLoading }) => {
    const [filter, setFilter] = useState('inbox');

    const filtered = enquiries.filter(e => {
        if (filter === 'unread') return !e.is_read && !e.is_archived;
        if (filter === 'archived') return !!e.is_archived;
        return !e.is_archived;
    });

    const toggleRead = async (id, current) => {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) throw new Error('Authentication required. Please log in again.');
            await api(`/api/admin/enquiries/${id}/read`, { 
                method: 'PATCH', 
                token,
                body: { is_read: !current }
            });
            onRefresh();
        } catch (err) { 
            alert(err.message || 'Failed to update message status.');
            console.error('[TOGGLE_READ_ERROR]', err);
        }
    };

    const toggleArchive = async (id, current) => {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) throw new Error('Authentication required. Please log in again.');
            await api(`/api/admin/enquiries/${id}/archive`, { 
                method: 'PATCH', 
                token,
                body: { is_archived: !current }
            });
            onRefresh();
        } catch (err) { 
            alert(err.message || 'Failed to archive message.');
            console.error('[TOGGLE_ARCHIVE_ERROR]', err);
        }
    };

    const deleteEnquiry = async (id) => {
        if (!confirm('Permanently delete this enquiry?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) throw new Error('Authentication required. Please log in again.');
            await api(`/api/admin/enquiries/${id}`, { 
                method: 'DELETE', 
                token
            });
            onRefresh();
        } catch (err) { 
            alert(err.message || 'Failed to delete enquiry.');
            console.error('[DELETE_ENQUIRY_ERROR]', err);
        }
    };

    if (isLoading && enquiries.length === 0) return (
        <div className="text-center py-20 text-slate-400">
            <div className="h-8 w-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Accessing Communication Logs</p>
        </div>
    );

    const unreadCount = enquiries.filter(e => !e.is_read && !e.is_archived).length;

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Enquiries</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage traveler communications and requests</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {[
                        { id: 'inbox', label: 'Inbox', count: enquiries.filter(e => !e.is_archived).length },
                        { id: 'unread', label: 'Unread', count: unreadCount },
                        { id: 'archived', label: 'Trash' }
                    ].map(t => (
                        <button 
                            key={t.id}
                            onClick={() => setFilter(t.id)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            {t.label} 
                            {t.count !== undefined && t.count > 0 && <span className="ml-2 opacity-50">({t.count})</span>}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px] table-fixed">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 w-1/4 text-xs font-bold uppercase tracking-wider text-slate-500">From</th>
                                <th className="p-4 w-1/2 text-xs font-bold uppercase tracking-wider text-slate-500">Message Content</th>
                                <th className="p-4 w-1/4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(e => (
                                <tr key={e.id} className={`hover:bg-slate-50 transition-colors ${!e.is_read ? 'bg-blue-50/30' : ''}`}>
                                    <td className="p-4 align-top">
                                        <div className={`text-sm ${!e.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                                            {e.name}
                                            {!e.is_read && <span className="ml-2 h-2 w-2 rounded-full bg-blue-500 inline-block" />}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1 truncate">{e.email}</div>
                                        <div className="text-[10px] font-semibold text-slate-400 mt-2 uppercase tracking-wider">{new Date(e.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className={`text-sm leading-relaxed ${!e.is_read ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                            {e.message}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right align-top">
                                        <div className="flex justify-end gap-1">
                                            <button 
                                                onClick={() => toggleRead(e.id, e.is_read)}
                                                className={`p-2 rounded-lg transition-all ${e.is_read ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' : 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'}`}
                                                title={e.is_read ? 'Mark Unread' : 'Mark Read'}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => toggleArchive(e.id, e.is_archived)}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                title={e.is_archived ? 'Restore from Trash' : 'Move to Trash'}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                            {e.is_archived && (
                                                <button 
                                                    onClick={() => deleteEnquiry(e.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Permanently Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-20 text-center">
                                        <div className="bg-slate-50 inline-block p-6 rounded-full mb-4">
                                            <svg className="w-8 h-8 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                                        </div>
                                        <p className="font-semibold text-slate-400 italic">No messages found in this selection.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PackageEditor = ({ packages, onRefresh, isLoading }) => {
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newPkg, setNewPkg] = useState({
        id: '', name: '', price: '', duration: '', image: '', districts: '', features: ''
    });

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) throw new Error('Authentication required. Please log in again.');
            
            const districts = typeof newPkg.districts === 'string' ? newPkg.districts.split(',').map(s => s.trim()).filter(Boolean) : newPkg.districts;
            const features = typeof newPkg.features === 'string' ? newPkg.features.split(',').map(s => s.trim()).filter(Boolean) : newPkg.features;
            
            if (editingId) {
                await api(`/api/admin/packages/${editingId}`, { 
                    method: 'PUT', 
                    token,
                    body: { ...newPkg, districts, features, price: Number(newPkg.price) } 
                });
            } else {
                await api('/api/admin/packages', { 
                    method: 'POST', 
                    token,
                    body: { ...newPkg, districts, features, price: Number(newPkg.price) } 
                });
            }
            
            setShowAdd(false);
            setEditingId(null);
            setNewPkg({ id: '', name: '', price: '', duration: '', image: '', districts: '', features: '' });
            onRefresh();
        } catch (err) {
            alert(err.message || 'Failed to save package.');
            console.error('[SAVE_PACKAGE_ERROR]', err);
        }
    };

    const startEdit = (pkg) => {
        setNewPkg({
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
            duration: pkg.duration,
            image: pkg.image,
            districts: Array.isArray(pkg.districts) ? pkg.districts.join(', ') : pkg.districts || '',
            features: Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features || ''
        });
        setEditingId(pkg.id);
        setShowAdd(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) return;
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) throw new Error('Authentication required. Please log in again.');
            
            await api(`/api/admin/packages/${encodeURIComponent(id)}`, { 
                method: 'DELETE', 
                token 
            });
            onRefresh();
        } catch (err) {
            alert(err.message || 'Failed to delete package.');
            console.error('[DELETE_PACKAGE_ERROR]', err);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and curate travel experience packages</p>
                </div>
                <button 
                    onClick={() => {
                        if (showAdd) {
                            setShowAdd(false);
                            setEditingId(null);
                            setNewPkg({ id: '', name: '', price: '', duration: '', image: '', districts: '', features: '' });
                        } else {
                            setShowAdd(true);
                        }
                    }}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${showAdd ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showAdd ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        )}
                    </svg>
                    {showAdd ? 'Cancel' : 'New Package'}
                </button>
            </header>

            {showAdd && (
                <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-lg ring-1 ring-slate-900/5 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">{editingId ? 'Edit Package' : 'Create New Package'}</h2>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Package ID (Slug)</label>
                                <input value={newPkg.id} onChange={e => setNewPkg({...newPkg, id: e.target.value})} required disabled={!!editingId} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all disabled:opacity-50" placeholder="alleppey-premium" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Package Name</label>
                                <input value={newPkg.name} onChange={e => setNewPkg({...newPkg, name: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="Grand Marari Journey" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price (INR)</label>
                                <input type="number" value={newPkg.price} onChange={e => setNewPkg({...newPkg, price: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="15000" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                                <input value={newPkg.duration} onChange={e => setNewPkg({...newPkg, duration: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="3 Days, 2 Nights" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL</label>
                                <input value={newPkg.image} onChange={e => setNewPkg({...newPkg, image: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="https://images.unsplash.com/..." />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Districts (comma separated)</label>
                                <input value={newPkg.districts} onChange={e => setNewPkg({...newPkg, districts: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="Alappuzha, Kottayam" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Features (comma separated)</label>
                            <input value={newPkg.features} onChange={e => setNewPkg({...newPkg, features: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="Private Boat, Traditional Dining, Local Guide" />
                        </div>
                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button type="submit" className="bg-slate-900 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-black transition-all">
                                {editingId ? 'Update Package' : 'Publish Package'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(isLoading && packages.length === 0) ? (
                    <div className="col-span-full py-20 text-center text-slate-400">
                        <div className="h-8 w-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">Retrieving Package Inventory</p>
                    </div>
                ) : packages.map(pkg => (
                    <div key={pkg.id} className="bg-white p-5 border border-slate-200 rounded-xl flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
                        <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                            <img src={pkg.image} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div className="grow flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">{pkg.name}</h3>
                                <div className="flex gap-3 items-center mt-1">
                                    <span className="text-sm font-bold text-emerald-600">INR {pkg.price.toLocaleString()}</span>
                                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                                    <span className="text-xs font-semibold text-slate-500">{pkg.duration}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                                <button 
                                    onClick={() => startEdit(pkg)}
                                    className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(pkg.id)}
                                    className="px-3 bg-red-50 text-red-500 py-2 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                    title="Delete Package"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {!isLoading && packages.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                        No packages in inventory. Create your first one above.
                    </div>
                )}
            </div>
        </div>
    );
};

const BookingsView = ({ bookings, onRefresh, isLoading }) => {
    const handleDelete = async (id) => {
        if (!confirm('Cancel this booking?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) throw new Error('Authentication required. Please log in again.');
            
            await api(`/api/admin/bookings/${id}`, { 
                method: 'DELETE', 
                token 
            });
            onRefresh && onRefresh();
        } catch (err) {
            alert(err.message || 'Failed to cancel booking.');
            console.error('[DELETE_BOOKING_ERROR]', err);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">All Bookings</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Track and manage traveler reservations</p>
                </div>
                <button 
                    onClick={onRefresh} 
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    title="Refresh List"
                >
                    <svg className={`w-[18px] h-[18px] ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 font-bold text-[10px] uppercase tracking-[0.1em] text-slate-500">
                            <th className="px-6 py-4">Booking ID</th>
                            <th className="px-6 py-4">Traveler</th>
                            <th className="px-6 py-4">Package</th>
                            <th className="px-6 py-4">Travel Date</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading && bookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                    <div className="h-6 w-6 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Retrieving System Bookings</p>
                                </td>
                            </tr>
                        ) : bookings.map(b => (
                            <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs text-slate-400">#{b.id.toString().padStart(5, '0')}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">{b.applicant_name}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{b.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-slate-700">{b.package_name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-slate-600">
                                        {new Date(b.package_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleDelete(b.id)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all group"
                                    >
                                        <svg className="w-3.5 h-3.5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!isLoading && bookings.length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium italic">No active bookings found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function AdminPage() {
    const [step, setStep] = useState('login'); // login, verify, dash
    const [view, setView] = useState('overview');
    const [form, setForm] = useState({ email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [enquiries, setEnquiries] = useState([]);
    const [stats, setStats] = useState({ travelers: 0, bookings: 0, revenue: 0, enquiries: 0, packages: 0, members: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [packages, setPackages] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);

    const refreshData = useCallback(async () => {
        const token = localStorage.getItem('admin_token');
        if (!token) return;
        setDataLoading(true);
        try {
            const [enqData, statsData, packagesData, bookingsData, usersData] = await Promise.all([
                api('/api/admin/enquiries', { token }),
                api('/api/admin/stats', { token }),
                api('/api/packages'),
                api('/api/admin/bookings', { token }),
                api('/api/admin/users', { token })
            ]);
            setEnquiries(enqData);
            setStats(statsData.stats);
            setRecentBookings(statsData.recentBookings);
            setPackages(packagesData);
            setBookings(bookingsData);
            setUsers(usersData);
        } catch (e) {
            console.error('Data Refresh Error:', e);
            if (e.message?.includes('Unauthorized') || e.status === 401) {
                localStorage.removeItem('admin_token');
                setStep('login');
            }
        } finally {
            setDataLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            setStep('dash');
            refreshData();
            const interval = setInterval(refreshData, 60000); // refresh every minute
            return () => clearInterval(interval);
        }
    }, [refreshData]);

    const unreadCount = enquiries.filter(e => !e.is_read && !e.is_archived).length;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api('/api/admin/login', { method: 'POST', body: form });
            setStep('verify');
        } catch (e) { 
            setError(e.message || 'Login failed. Please verify your credentials.');
            console.error('[LOGIN_ERROR]', e);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api('/api/admin/verify', { method: 'POST', body: { email: form.email, code: otp } });
            localStorage.setItem('admin_token', res.token);
            setStep('dash');
            refreshData();
        } catch (e) { 
            setError(e.message || 'Verification code is invalid or expired.');
            console.error('[VERIFY_ERROR]', e);
        } finally {
            setLoading(false);
        }
    };

    if (step === 'login') return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner">
            <div className="flex-1 bg-slate-900 hidden md:flex flex-col justify-center p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2676&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="relative z-10 max-w-lg">
                    <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-6 block">Secure Management Portal</span>
                    <h1 className="text-5xl font-bold mb-8 leading-tight">Professional <br/>Administration <br/><span className="text-emerald-400">Environment.</span></h1>
                    <p className="text-slate-400 text-sm leading-relaxed">Authorized administrative access only. System activity is monitored and recorded for security and audit purposes.</p>
                </div>
            </div>

            <div className="w-full md:w-[600px] flex items-center justify-center p-6 md:p-20 bg-white">
                <div className="w-full max-w-sm">
                    <header className="mb-12 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Kalindi Dashboard</h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Internal Access System</p>
                    </header>

                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h2>
                        <p className="text-xs font-medium text-slate-500">Provide your authentication credentials to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-1.5 rounded-lg">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Administrator Email</label>
                            <input 
                                type="email" 
                                placeholder="admin@kalindi.com" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all" 
                                onChange={e => setForm({...form, email: e.target.value})} 
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center mb-1.5 px-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Access Key</label>
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showPassword ? 'Hide Key' : 'Show Key'}
                                </button>
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all" 
                                onChange={e => setForm({...form, password: e.target.value})} 
                                required
                            />
                        </div>

                        {error && <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600 text-center">{error}</div>}

                        <button 
                            disabled={loading} 
                            className="w-full bg-slate-900 text-white py-4 rounded-lg text-sm font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Verifying...' : 'Request Access Code'}
                        </button>
                    </form>

                    <footer className="mt-12 text-center text-slate-400">
                        <p className="text-[10px] font-bold uppercase tracking-widest">Copyright {new Date().getFullYear()} Kalindi Corporate Systems</p>
                    </footer>
                </div>
            </div>
        </div>
    );

    if (step === 'verify') return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100 text-center">
                <header className="mb-10 text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Security Verification</h2>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Code sent to {form.email}</p>
                </header>

                <form onSubmit={handleVerify} className="space-y-8">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <input 
                            value={otp} 
                            onChange={e => setOtp(e.target.value)} 
                            maxLength={6} 
                            placeholder="0 0 0 0 0 0" 
                            className="w-full bg-transparent text-4xl text-center font-bold outline-none tracking-[0.2em] placeholder:text-slate-200" 
                            autoFocus 
                        />
                    </div>

                    {error && <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600">{error}</div>}

                    <div className="flex flex-col gap-4">
                        <button 
                            disabled={loading} 
                            className="w-full bg-slate-900 text-white py-4 rounded-lg text-sm font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify & Access'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setStep('login')} 
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1"
                        >
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-inner">
            {/* Mobile Header */}
            <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">Kalindi</span>
                    <span className="text-[10px] font-bold tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">Admin</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-all"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-screen z-50 transition-transform duration-300 ease-in-out border-r border-slate-800
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:sticky md:top-0
            `}>
                <div className="p-8 pb-10 hidden md:block">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight text-white">Kalindi</span>
                        <span className="text-[9px] font-bold text-emerald-400 border border-emerald-400/30 px-1.5 py-0.5 rounded uppercase">System</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {[
                        { id: 'overview', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                        { id: 'bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                        { id: 'packages', label: 'Packages', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                        { id: 'users', label: 'Travelers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                        { id: 'enquiries', label: 'Enquiries', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', badge: unreadCount }
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => {
                                setView(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all w-full text-left ${view === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            <span className="flex-1">{item.label}</span>
                            {item.badge > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${view === item.id ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'}`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800/50">
                    <button 
                        onClick={() => {
                            localStorage.removeItem('admin_token');
                            setStep('login');
                        }} 
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                    <div className="mt-4 px-4 pb-2">
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">v2.1.0 Institutional</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-6 md:p-10">
                    {dataLoading && enquiries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                            <div className="h-8 w-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                            <p className="text-sm font-bold uppercase tracking-widest">Database Synchronization in Progress</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {view === 'overview' && (
                                <Dashboard 
                                    stats={stats} 
                                    recentBookings={bookings.slice(0, 10)} 
                                    enquiries={enquiries} 
                                    setView={setView} 
                                />
                            )}
                            {view === 'bookings' && (
                                <BookingsView 
                                    bookings={bookings} 
                                    onRefresh={refreshData} 
                                    isLoading={dataLoading}
                                />
                            )}
                            {view === 'packages' && (
                                <PackageEditor 
                                    packages={packages} 
                                    onRefresh={refreshData} 
                                    isLoading={dataLoading}
                                />
                            )}
                            {view === 'users' && (
                                <TravelerList 
                                    users={users} 
                                    onRefresh={refreshData} 
                                    isLoading={dataLoading} 
                                />
                            )}
                            {view === 'enquiries' && (
                                <EnquiriesView 
                                    enquiries={enquiries} 
                                    onRefresh={refreshData} 
                                    isLoading={dataLoading}
                                />
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
