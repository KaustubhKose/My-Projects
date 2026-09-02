import React, { useState, useMemo } from 'react';
import { 
  Pill, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Sparkles,
  X,
  Package,
  Layers
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { MedicineInventoryItem } from '../../types';

export const MedicineInventoryView: React.FC = () => {
  const { medicines, addMedicine, updateMedicineStock, prescriptions, issuePrescriptionMedication } = useEmergency();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'prescription_queue'>('inventory');

  // New Medicine Form State
  const [newMed, setNewMed] = useState<Omit<MedicineInventoryItem, 'id'>>({
    name: '',
    category: 'Cardiac',
    quantity: 100,
    minQuantity: 30,
    batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
    expiryDate: '2028-12-31',
    supplier: 'Apex Med Supplies',
    price: 25.00,
    location: 'Rack A-01'
  });

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.location.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
      if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
      return true;
    });
  }, [medicines, searchQuery, selectedCategory]);

  const lowStockCount = medicines.filter(m => m.quantity <= m.minQuantity).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;
    addMedicine(newMed);
    setShowAddModal(false);
    setNewMed({
      name: '',
      category: 'Cardiac',
      quantity: 100,
      minQuantity: 30,
      batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: '2028-12-31',
      supplier: 'Apex Med Supplies',
      price: 25.00,
      location: 'Rack A-01'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center space-x-2">
            <Pill className="w-6 h-6 text-cyan-400" />
            <span>Emergency Medicine Inventory & Pharmacy Hub</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time drug inventory, batch traceability, automated low-stock warnings, and outpatient dispensing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Alert Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{lowStockCount} critical items</strong> have dropped below emergency buffer stock threshold! Auto-purchase orders suggested.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-100 font-bold text-[10px]">
            RESTOCK REQUIRED
          </span>
        </div>
      )}

      {/* Sub Tabs: Inventory vs Prescription Queue */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeSubTab === 'inventory'
              ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Drug Inventory ({medicines.length})
        </button>
        <button
          onClick={() => setActiveSubTab('prescription_queue')}
          className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeSubTab === 'prescription_queue'
              ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pharmacy Dispensing Queue ({prescriptions.length})
        </button>
      </div>

      {activeSubTab === 'inventory' ? (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="p-4 rounded-2xl glass-card border border-blue-500/20 bg-slate-950/80 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search medicine, batch number, shelf rack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {['ALL', 'Cardiac', 'Emergency IV', 'Respiratory', 'Analgesic', 'Antibiotic'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-600/40 text-cyan-300 border border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Medicine Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMedicines.map(med => {
              const isLowStock = med.quantity <= med.minQuantity;
              return (
                <div
                  key={med.id}
                  className={`p-5 rounded-3xl glass-card border shadow-xl flex flex-col justify-between space-y-3 transition ${
                    isLowStock 
                      ? 'border-amber-500/60 bg-amber-950/10 hover:bg-amber-950/20' 
                      : 'border-blue-500/20 bg-slate-950/80 hover:border-cyan-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 font-semibold">
                        {med.category}
                      </span>
                      {isLowStock && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase animate-pulse">
                          Low Stock
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white font-heading">{med.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Location: <strong className="text-slate-200">{med.location}</strong></p>

                    <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-xs">
                      <div>
                        <div className={`text-base font-black font-heading ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {med.quantity}
                        </div>
                        <div className="text-[9px] text-slate-400">Current Stock</div>
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-300 font-heading">{med.minQuantity}</div>
                        <div className="text-[9px] text-slate-400">Min Buffer</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400">
                      <div>Batch: <span className="font-mono text-slate-300">{med.batchNumber}</span></div>
                      <div>Expiry: <span className="text-slate-300">{med.expiryDate}</span></div>
                      <div>Unit Price: <span className="text-emerald-400 font-semibold">${med.price.toFixed(2)}</span></div>
                    </div>
                  </div>

                  {/* Stock In / Out Action Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => updateMedicineStock(med.id, 20, 'IN')}
                      className="w-1/2 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      <span>Stock +20</span>
                    </button>
                    <button
                      onClick={() => updateMedicineStock(med.id, 10, 'OUT')}
                      className="w-1/2 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-[11px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <ArrowDownCircle className="w-3.5 h-3.5" />
                      <span>Dispense -10</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* PHARMACY DISPENSING QUEUE */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-card border border-blue-500/20 bg-slate-950/80">
            <h3 className="text-sm font-bold text-white font-heading">
              Active Outpatient & Emergency Prescription Queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review doctor orders and issue medications to patients in real-time.
            </p>
          </div>

          <div className="space-y-3">
            {prescriptions.map(rx => (
              <div
                key={rx.id}
                className="p-5 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white font-heading">{rx.medicineName} ({rx.dosage})</h4>
                      <span className="px-2 py-0.2 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-400">
                        {rx.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Prescribed by {rx.doctorName} • Duration: {rx.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                  <button
                    onClick={() => issuePrescriptionMedication(rx.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dispense & Verify</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl glass-card border border-cyan-500/50 bg-[#0A0F1D] shadow-2xl p-6 sm:p-8 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-heading">Add New Drug to Inventory</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medicine Name & Formulation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Atropine 0.5mg/ml"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Therapeutic Category</label>
                  <select
                    value={newMed.category}
                    onChange={(e) => setNewMed({ ...newMed, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Cardiac">Cardiac</option>
                    <option value="Emergency IV">Emergency IV</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Anesthesia">Anesthesia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Storage Location</label>
                  <input
                    type="text"
                    value={newMed.location}
                    onChange={(e) => setNewMed({ ...newMed, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Units</label>
                  <input
                    type="number"
                    value={newMed.quantity}
                    onChange={(e) => setNewMed({ ...newMed, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Buffer</label>
                  <input
                    type="number"
                    value={newMed.minQuantity}
                    onChange={(e) => setNewMed({ ...newMed, minQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMed.price}
                    onChange={(e) => setNewMed({ ...newMed, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newMed.batchNumber}
                    onChange={(e) => setNewMed({ ...newMed, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newMed.expiryDate}
                    onChange={(e) => setNewMed({ ...newMed, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer mt-2"
              >
                Confirm Drug Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
