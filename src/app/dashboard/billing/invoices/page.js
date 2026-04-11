"use client"

import React, { useState, useEffect } from 'react'
import { Receipt, AlertCircle, FileText, CheckCircle2, XCircle, CreditCard, Clock, Loader2, Smartphone } from 'lucide-react'
import { accountService } from '@/services/account'
import { Skeleton } from '@/components/Skeleton'

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // Payment Modal State
    const [isPayModalOpen, setIsPayModalOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isPaying, setIsPaying] = useState(false)
    const [payStatus, setPayStatus] = useState(null) // null, 'pending', 'success', 'failed'
    const [payMessage, setPayMessage] = useState('')
    const [checkoutId, setCheckoutId] = useState(null)

    useEffect(() => {
        fetchInvoices()
    }, [])
    
    // Polling effect
    useEffect(() => {
        let pollInterval;
        if (checkoutId && payStatus === 'pending') {
            pollInterval = setInterval(async () => {
                try {
                    const result = await accountService.verifyPayment(checkoutId);
                    if (result.status === 'success') {
                        setPayStatus('success');
                        setPayMessage(result.message);
                        setCheckoutId(null);
                        clearInterval(pollInterval);
                        fetchInvoices();
                    } else if (result.status === 'failed') {
                        setPayStatus('failed');
                        setPayMessage(result.message);
                        setCheckoutId(null);
                        clearInterval(pollInterval);
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 5000); // poll every 5 seconds
        }
        
        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [checkoutId, payStatus]);

    const fetchInvoices = async () => {
        setLoading(true)
        try {
            const result = await accountService.getInvoices()
            if (result.status === 'success') {
                setInvoices(result.data)
            } else {
                throw new Error(result.message)
            }
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }
    
    const handlePayClick = (invoice) => {
        setSelectedInvoice(invoice)
        setPhoneNumber('') // Reset or fetch from account if we had it
        setIsPayModalOpen(true)
        setPayStatus(null)
        setPayMessage('')
    }
    
    const submitPayment = async (e) => {
        e.preventDefault()
        if (!phoneNumber) return;
        
        setIsPaying(true)
        setPayStatus(null)
        setPayMessage('')
        
        try {
            const result = await accountService.payInvoice(selectedInvoice.id, phoneNumber)
            if (result.status === 'success') {
                setPayStatus('pending')
                setCheckoutId(result.checkout_id)
                setPayMessage('Please enter your M-Pesa PIN on your phone...')
            } else {
                setPayStatus('failed')
                setPayMessage(result.message)
            }
        } catch (err) {
            setPayStatus('failed')
            setPayMessage(err.message || 'Payment initiation failed')
        }
        setIsPaying(false)
    }
    
    const closePayModal = () => {
        // Prevent closing if pending
        if (payStatus === 'pending') return;
        setIsPayModalOpen(false)
        setSelectedInvoice(null)
        setCheckoutId(null)
    }

    if (loading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500 pb-10 font-figtree max-w-[1400px] mx-auto px-4 sm:px-0">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-pace-border pb-3">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32 bg-gray-100 dark:bg-gray-800" />
                        <Skeleton className="h-3 w-64 bg-gray-100 dark:bg-gray-800" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full rounded-xl bg-gray-100 dark:bg-gray-800" />
                    <Skeleton className="h-16 w-full rounded-xl bg-gray-100 dark:bg-gray-800" />
                    <Skeleton className="h-16 w-full rounded-xl bg-gray-100 dark:bg-gray-800" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <AlertCircle size={20} />
                </div>
                <h2 className="text-sm font-semibold text-admin-value">Error Loading Invoices</h2>
                <p className="text-xs text-admin-dim mt-2 max-w-sm">{error}</p>
                <button
                    onClick={fetchInvoices}
                    className="mt-6 px-4 py-2 bg-pace-purple text-white rounded text-xs font-medium"
                >
                    Retry
                </button>
            </div>
        )
    }

    const getStatusConfig = (status) => {
        switch (status) {
            case 'paid':
                return { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2, label: 'Paid' }
            case 'pending':
                return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock, label: 'Pending' }
            case 'overdue':
                return { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle, label: 'Overdue' }
            default:
                return { color: 'text-gray-500', bg: 'bg-gray-500/10', icon: FileText, label: status }
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 font-figtree text-left max-w-[1400px] mx-auto px-4 sm:px-0 relative">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-pace-border pb-3">
                <div>
                    <h1 className="text-lg font-semibold text-admin-value tracking-tight">Invoices</h1>
                    <p className="text-xs text-admin-dim mt-0.5">Manage and pay your monthly bills.</p>
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-[10px] text-admin-dim font-medium uppercase tracking-wider bg-pace-bg-subtle px-2 py-1 rounded">Grace Period: 1 Day</span>
                </div>
            </div>

            <div className="bg-card-bg border border-pace-border rounded-xl shadow-sm overflow-hidden">
                {invoices.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center space-y-3">
                        <Receipt className="text-admin-dim opacity-50" size={32} />
                        <p className="text-sm font-medium text-admin-value">No invoices found</p>
                        <p className="text-xs text-admin-dim">Your generated invoices will appear here at the end of your billing cycle.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-pace-border">
                        {invoices.map((invoice) => {
                            const config = getStatusConfig(invoice.status);
                            const Icon = config.icon;
                            
                            return (
                                <div key={invoice.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-pace-bg-subtle/50 transition-colors">
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-admin-value">{invoice.invoice_number}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-admin-dim font-medium">
                                                <span>Due: {new Date(invoice.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                                                <span>KSH {parseFloat(invoice.amount).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.color}`}>
                                            {config.label}
                                        </div>
                                        
                                        {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                            <button 
                                                onClick={() => handlePayClick(invoice)}
                                                className="px-4 py-1.5 bg-pace-purple text-white text-xs font-semibold rounded-lg hover:bg-pace-purple/90 transition-all flex items-center gap-1.5 shadow-sm"
                                            >
                                                <CreditCard size={14} />
                                                <span>Pay Now</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {isPayModalOpen && selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card-bg rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-pace-border">
                        <div className="p-5 border-b border-pace-border flex items-center justify-between bg-pace-bg-subtle/50">
                            <h3 className="text-sm font-semibold text-admin-value flex items-center gap-2">
                                <CreditCard size={16} className="text-pace-purple" />
                                Pay Invoice
                            </h3>
                            {payStatus !== 'pending' && (
                                <button onClick={closePayModal} className="text-admin-dim hover:text-admin-value transition-colors">
                                    <XCircle size={18} />
                                </button>
                            )}
                        </div>
                        
                        <div className="p-5 space-y-4">
                            <div className="bg-pace-bg-subtle p-3 rounded-lg border border-pace-border flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-admin-dim font-semibold uppercase tracking-wider">Amount Due</p>
                                    <p className="text-lg font-bold text-admin-value mt-0.5">KSH {parseFloat(selectedInvoice.amount).toLocaleString()}</p>
                                </div>
                                <Receipt className="text-admin-dim/50" size={24} />
                            </div>
                            
                            {/* State: Initial or Failed */}
                            {(!payStatus || payStatus === 'failed') && (
                                <form onSubmit={submitPayment} className="space-y-4">
                                    {payStatus === 'failed' && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                                            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-600 font-medium">{payMessage}</p>
                                        </div>
                                    )}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-admin-value">M-Pesa Phone Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 0712345678"
                                            className="w-full px-3 py-2 bg-transparent border border-pace-border rounded-lg text-sm text-admin-value outline-none focus:border-pace-purple"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isPaying || !phoneNumber}
                                        className="w-full py-2 bg-pace-purple text-white rounded-lg text-xs font-semibold disabled:opacity-50 hover:bg-pace-purple/90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        {isPaying ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                                        {isPaying ? "Initiating..." : "Pay via M-Pesa"}
                                    </button>
                                </form>
                            )}
                            
                            {/* State: Pending / Waiting for PIN */}
                            {payStatus === 'pending' && (
                                <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 relative">
                                        <div className="absolute inset-0 border-4 border-pace-purple/30 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-pace-purple border-t-transparent rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Smartphone size={20} className="text-pace-purple" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-admin-value mb-1">Waiting for Payment</h4>
                                        <p className="text-xs text-admin-dim font-medium">{payMessage}</p>
                                    </div>
                                </div>
                            )}

                            {/* State: Success */}
                            {payStatus === 'success' && (
                                <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-admin-value mb-1">Payment Successful!</h4>
                                        <p className="text-xs text-admin-dim font-medium">{payMessage}</p>
                                    </div>
                                    <button 
                                        onClick={closePayModal}
                                        className="mt-2 w-full py-2 bg-pace-bg-subtle text-admin-value border border-pace-border rounded-lg text-xs font-semibold hover:bg-pace-border transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
