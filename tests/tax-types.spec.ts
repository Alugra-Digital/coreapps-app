import { test, expect } from '@playwright/test';

test.describe('Tax Types Module', () => {
    const mockTaxTypes = [
        {
            id: 'TAX-001',
            code: 'PPN_11',
            name: 'PPN 11%',
            rate: 11,
            category: 'output_tax',
            description: 'PPN',
            applicableDocuments: ['invoice'],
            isActive: true
        }
    ];

    test.beforeEach(async ({ page }) => {
        await page.route('*/**/api/tax-types', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockTaxTypes),
            });
        });

        await page.route('*/**/api/tax-types/TAX-001', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockTaxTypes[0]),
            });
        });
    });

    test('should list tax types', async ({ page }) => {
        await page.goto('/finance/perpajakan');
        await expect(page.getByText('PPN 11%')).toBeVisible();
        await expect(page.getByText('output_tax')).toBeVisible();
    });
});
