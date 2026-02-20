import { test, expect } from '@playwright/test';

test.describe('Invoices Module', () => {
    const mockInvoices = [
        {
            id: 'INV-001',
            companyInfo: {
                companyName: 'PT Rubbick Indonesia',
                address: 'Jl. Sudirman No. 123',
                phone: '+62 21 1234567'
            },
            invoiceInfo: {
                invoiceName: 'Invoice Penjualan',
                invoiceNumber: 'INV-2025-001',
                invoiceDate: '2025-02-01',
                dueDate: '2025-02-15'
            },
            billingInfo: {
                companyName: 'PT Client',
                address: 'Jl. Client',
                phone: '123',
                pic: { name: 'Client PIC', position: 'Procurement' }
            },
            lineItems: [],
            paymentInfo: {
                bank: 'Mandiri',
                accountNumber: '123',
                branch: 'Sudirman',
                accountName: 'PT Rubbick'
            },
            approval: { position: 'Direktur', name: 'Achmad Hakim' }
        }
    ];

    test.beforeEach(async ({ page }) => {
        await page.route('*/**/api/invoices', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockInvoices),
            });
        });

        await page.route('*/**/api/invoices/INV-001', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockInvoices[0]),
            });
        });
    });

    test('should list invoices', async ({ page }) => {
        await page.goto('/invoice'); // Assuming route is /invoice based on sidebar conventions or file structure
        await expect(page.getByText('INV-2025-001')).toBeVisible();
        await expect(page.getByText('PT Client')).toBeVisible();
    });
});
