import { test, expect } from '@playwright/test';

test.describe('Positions Module', () => {
    const mockPositions = [
        {
            id: 'POS-001',
            name: 'DIREKTUR',
            code: 'DIR',
            isActive: true,
        },
        {
            id: 'POS-002',
            name: 'Project Manager',
            code: 'PM',
            isActive: true,
        },
    ];

    test.beforeEach(async ({ page }) => {
        // Mock API response
        await page.route('*/**/api/positions', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPositions),
            });
        });

        await page.route('*/**/api/positions/POS-001', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPositions[0]),
            });
        });
    });

    test('should list positions', async ({ page }) => {
        await page.goto('/hr/positions');
        await expect(page.getByText('DIREKTUR')).toBeVisible();
        await expect(page.getByText('Project Manager')).toBeVisible();
    });
});
