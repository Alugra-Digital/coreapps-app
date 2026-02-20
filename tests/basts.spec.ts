import { test, expect } from '@playwright/test';

test.describe('BAST Module', () => {
    const mockBasts = [
        {
            id: 'BAST-001',
            coverInfo: {
                jobOffer: 'Jasa',
                companyName: 'PT Rubbick',
                bastMonth: '2025-02',
                address: 'Jl Sudirman',
                phone: '123'
            },
            documentInfo: {
                bastNumber: 'BAST-2025-001',
                bastDate: '2025-02-15'
            },
            deliveringParty: {
                name: 'Budi',
                position: 'PM',
                company: 'PT Rubbick'
            },
            receivingParty: {
                name: 'Hakim',
                position: 'IT',
                company: 'Client'
            }
        }
    ];

    test.beforeEach(async ({ page }) => {
        await page.route('*/**/api/basts', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockBasts),
            });
        });

        await page.route('*/**/api/basts/BAST-001', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockBasts[0]),
            });
        });
    });

    test('should list BASTs', async ({ page }) => {
        await page.goto('/finance/bast');
        await expect(page.getByText('BAST-2025-001')).toBeVisible();
        await expect(page.getByText('Jasa')).toBeVisible();
    });
});
