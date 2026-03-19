import { test, expect } from '@playwright/test';

const mockPOs = [
    {
        id: 'PO-001',
        companyInfo: {
            companyName: 'PT Rubbick Indonesia',
            address: 'Jl. Sudirman No. 123',
            phone: '+62 21 1234567'
        },
        orderInfo: {
            poDate: '2025-02-01',
            poNumber: 'PO-2025-001',
        },
        vendorInfo: {
            vendorName: 'PT Supplier Teknologi',
            phone: '+62 21 7654321',
            pic: { name: 'Budi', position: 'Sales' }
        },
        lineItems: [],
        approval: { position: 'Direktur', name: 'Achmad Hakim' }
    }
];

const mockCPOs = [
    {
        id: 1,
        cpoNumber: 'CPO/2025/001',
        clientId: 1,
        clientName: 'PT Klien Masuk',
        projectId: null,
        projectName: null,
        amount: 50000000,
        currency: 'IDR',
        ppnIncluded: true,
        issuedDate: '2025-03-01',
        receivedDate: '2025-03-02',
        validUntil: null,
        description: 'Project renovation',
        paymentTerms: 'NET 30',
        status: 'RECEIVED',
        attachmentUrl: null,
        attachmentName: null,
        verifiedBy: null,
        verifiedAt: null,
        notes: null,
        createdAt: '2025-03-02',
        createdBy: null,
        internalReference: null,
        linkedProposalId: null,
        linkedProposalVersion: null,
    }
];

test.describe('Purchase Orders Module', () => {
    test.beforeEach(async ({ page }) => {
        // Mock PO Keluar (outgoing) endpoint
        await page.route('*/**/api/finance/purchase-order*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPOs),
            });
        });

        // Mock PO Masuk (incoming / client) endpoint
        await page.route('*/**/api/finance/client-purchase-orders*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockCPOs),
            });
        });
    });

    test('should list PO Keluar on default tab', async ({ page }) => {
        await page.goto('/finance/purchase-orders');
        // Default tab is PO Keluar — wait for tab to be active
        await expect(page.locator('button[role="tab"]:has-text("PO Keluar")')).toBeVisible();
        await expect(page.getByText('PO-2025-001')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('PT Supplier Teknologi')).toBeVisible();
    });

    test('should switch to PO Masuk tab and show incoming POs', async ({ page }) => {
        await page.goto('/finance/purchase-orders');
        await page.locator('button[role="tab"]:has-text("PO Masuk")').click();
        await expect(page.getByText('CPO/2025/001')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('PT Klien Masuk')).toBeVisible();
    });
});
