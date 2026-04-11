'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { PlusIcon } from '@/components/ui/Icons';

export default function LabtechInventory() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const items = [
    { id: 'LAB-001', name: 'Malaria RDT Kits', category: 'Testing Kits', quantity: 15, unit: 'Boxes', status: 'low' },
    { id: 'LAB-002', name: 'Vacutainer Tubes (Purple)', category: 'Collection', quantity: 250, unit: 'Units', status: 'instock' },
    { id: 'LAB-003', name: 'Gloves (Nitrile)', category: 'PPE', quantity: 2, unit: 'Boxes', status: 'out' },
    { id: 'LAB-004', name: 'Blood Glucose Strips', category: 'Testing Kits', quantity: 45, unit: 'Boxes', status: 'instock' },
    { id: 'LAB-005', name: 'Centrifuge Tubes', category: 'Eqpt Consumables', quantity: 120, unit: 'Units', status: 'instock' },
  ];

  if (loading) return <SkeletonLoader height={52} count={6} />;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div />
        <Button><PlusIcon size={16} /> Reorder Supplies</Button>
      </div>

      <Table headers={['Item ID', 'Item Name', 'Category', 'Quantity', 'Unit', 'Status', 'Action']}>
        {items.map(i => (
          <tr key={i.id} className={i.status === 'low' ? styles.lowStockRow : i.status === 'out' ? styles.outStockRow : ''}>
            <td>{i.id}</td>
            <td><strong>{i.name}</strong></td>
            <td>{i.category}</td>
            <td>
              <div className="relative">
                <input className="w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none" defaultValue={i.quantity} />
              </div>
            </td>
            <td>{i.unit}</td>
            <td><Badge status={i.status} /></td>
            <td>
              <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Update</Button>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
