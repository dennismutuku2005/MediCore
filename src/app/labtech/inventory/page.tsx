'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { PlusIcon } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function LabtechInventory() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await apiFetch('/inventory');
      if (res.status === 'success') {
        setItems(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (item: any, newQty: number) => {
    setUpdatingId(item.id);
    try {
      // Determine status based on quantity
      let status = 'instock';
      if (newQty === 0) status = 'out';
      else if (newQty < 10) status = 'low';

      await apiFetch('/inventory', {
        method: 'POST',
        body: JSON.stringify({ ...item, quantity: newQty, status })
      });
      await fetchData();
    } catch (error) {
      toast.error("Failed to update inventory.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="space-y-3">
      <SkeletonLoader height={52} count={8} className="rounded" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Diagnostic Consumables Matrix</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory tracking for reagents and clinical supplies</p>
        </div>
        <Button className="h-10 text-[11px] font-black uppercase tracking-widest">
          <PlusIcon size={14} /> 
          <span className="ml-2">Provision Reorder</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table headers={['Stock ID', 'Supply Item Name', 'Classification', 'Quantity', 'Unit Metric', 'Status', 'Operational Action']}>
          {items.map(i => (
            <tr key={i.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-medium">
              <td className="px-5 py-4 text-sm text-slate-400 font-mono tracking-tighter">#{i.id}</td>
              <td className="px-5 py-4 text-sm font-black text-slate-800">{i.name}</td>
              <td className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{i.category}</td>
              <td className="px-5 py-4">
                <input 
                  type="number"
                  className="w-20 h-8 px-2 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none font-bold" 
                  defaultValue={i.quantity} 
                  id={`qty-${i.id}`}
                />
              </td>
              <td className="px-5 py-4 text-sm text-slate-500">{i.unit}</td>
              <td className="px-5 py-4"><Badge status={i.status} /></td>
              <td className="px-5 py-4">
                <Button 
                  variant="secondary" 
                  className="h-8 px-3 text-[10px] font-black uppercase tracking-widest shadow-sm"
                  loading={updatingId === i.id}
                  onClick={() => {
                    const input = document.getElementById(`qty-${i.id}`) as HTMLInputElement;
                    handleUpdate(i, parseInt(input.value));
                  }}
                >
                  Sync Stock
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            No inventory protocols identified in the registry
          </div>
        )}
      </div>
    </div>
  );
}
