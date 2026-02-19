import { test, expect } from '@playwright/test';

test.describe('Purchase Orders Module', () => {
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

    test.beforeEach(async ({ page }) => {
        await page.route('*/**/api/purchase-orders', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPOs),
            });
        });

        await page.route('*/**/api/purchase-orders/PO-001', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPOs[0]),
            });
        });
    });

    test('should list purchase orders', async ({ page }) => {
        await page.goto('/finance/purchase-orders');
        await expect(page.getByText('PO-2025-001')).toBeVisible();
        await expect(page.getByText('PT Supplier Teknologi')).toBeVisible();
    });
});
