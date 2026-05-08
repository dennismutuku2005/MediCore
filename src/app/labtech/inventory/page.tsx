'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { PlusIcon, SearchIcon, TrashIcon, EditIcon, ActivityIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

const EMPTY_FORM = { id: '', itemCode: '', name: '', category: 'Reagents', quantity: 0, reorderLevel: 10, unit: 'Pieces' };

export default function LabtechInventory() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiFetch('/labtech/inventory');
      if (res.status === 'success') {
        setItems(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingItem(null); setModalOpen(true); };
  const openEdit = (item: any) => { setForm(item); setEditingItem(item); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name || form.quantity === undefined) {
      toast.error("Item name and quantity are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch('/labtech/inventory', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.status === 'success') {
        toast.success(editingItem ? "Supply updated" : "New supply registered");
        await fetchData();
        setModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to save inventory protocol.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Decommission this supply from the diagnostic matrix?")) {
      try {
        await apiFetch(`/labtech/inventory?id=${id}`, { method: 'DELETE' });
        toast.success("Supply decommissioned");
        await fetchData();
      } catch (error) {
        toast.error("Failed to remove item.");
      }
    }
  };

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase()) ||
    String(i.id).includes(search)
  );

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-between"><SkeletonLoader width={250} height={40} /><SkeletonLoader width={150} height={40} /></div>
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <SkeletonLoader variant="row" count={8} />
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Diagnostic Consumables Matrix</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory tracking for reagents and clinical supplies</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-[260px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <SearchIcon size={14} />
            </span>
            <input 
              className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 shadow-sm"
              placeholder="Search supplies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={openAdd} className="h-10 text-[11px] font-black uppercase tracking-widest">
            <PlusIcon size={14} /> 
            <span className="ml-2">Provision Reorder</span>
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <ActivityIcon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total SKU Count</p>
            <p className="text-xl font-black text-slate-900">{items.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
             ⚠️
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical Stock</p>
            <p className="text-xl font-black text-slate-900">{items.filter(i => i.status === 'Low' || i.status === 'Out of Stock').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Supply Registry</h3>
          <Badge status="info">{filtered.length} Displayed</Badge>
        </div>
        <Table headers={['Stock ID', 'Supply Item Name', 'Classification', 'Quantity', 'Metric', 'Status', 'Operations']}>
          {filtered.map(i => (
            <tr key={i.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium group">
              <td className="px-5 py-4 text-sm text-slate-400 font-mono tracking-tighter">#{i.id}</td>
              <td className="px-5 py-4 text-sm font-black text-slate-800">{i.name}</td>
              <td className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{i.category}</td>
              <td className="px-5 py-4">
                 <span className={`text-sm font-black ${i.quantity < i.reorderLevel ? 'text-rose-600' : 'text-slate-900'}`}>
                   {i.quantity}
                 </span>
              </td>
              <td className="px-5 py-4 text-sm text-slate-500">{i.unit}</td>
              <td className="px-5 py-4"><Badge status={i.status} /></td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEdit(i)}
                    className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-all opacity-0 group-hover:opacity-100"
                    title="Edit Protocol"
                  >
                    <EditIcon size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(i.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-all opacity-0 group-hover:opacity-100"
                    title="Decommission"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            {search ? `No protocols match "${search}"` : 'No inventory protocols identified in the registry'}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Modify Supply Protocol" : "Provision New Clinical Supply"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Abort interface</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Committing...' : 'Confirm Protocol'}</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Item Code (SKU)" placeholder="e.g. EDTA-001" value={form.itemCode} onChange={e => setForm({...form, itemCode: e.target.value})} />
            <Input label="Supply Nomenclature" placeholder="e.g. EDTA Vacuum Tubes" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Classification" options={[{value:'Reagents',label:'Reagents'},{value:'Glassware',label:'Glassware'},{value:'Consumables',label:'Consumables'},{value:'Equipment',label:'Equipment'}]} value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            <Input label="Unit Metric" options={[{value:'Pieces',label:'Pieces'},{value:'Vials',label:'Vials'},{value:'Litres',label:'Litres'},{value:'Kits',label:'Kits'}]} value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Current Stock Quantity" type="number" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} />
            <Input label="Reorder Threshold" type="number" value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel: parseInt(e.target.value)})} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
