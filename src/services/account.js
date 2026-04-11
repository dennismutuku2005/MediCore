import authService from '@/lib/auth';
import { API_BASE } from '@/lib/api-config';

export const accountService = {
    /**
     * Fetch account and subscription details from the central admin database
     */
    async getAccountDetails() {
        const url = `${API_BASE}/account.php`;
        try {
            const response = await authService.authenticatedFetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch account details');
            }
            return await response.json();
        } catch (error) {
            console.error("Account Service Error:", error);
            throw error;
        }
    },
    
    async getInvoices() {
        const url = `${API_BASE}/invoices.php`;
        try {
            const response = await authService.authenticatedFetch(url);
            if (!response.ok) throw new Error('Failed to fetch invoices');
            return await response.json();
        } catch (error) {
            console.error("Account Service Error:", error);
            throw error;
        }
    },
    
    async payInvoice(invoiceId, phone) {
        const url = `${API_BASE}/invoices.php`;
        try {
            const response = await authService.authenticatedFetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoice_id: invoiceId, phone })
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    },
    
    async verifyPayment(checkoutId) {
        const url = `${API_BASE}/invoice_verify.php`;
        try {
            const response = await authService.authenticatedFetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checkout_id: checkoutId })
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};

export default accountService;
