import { test, expect } from '@playwright/test';

test.describe('Projects Module', () => {
    const mockProjects = [
        {
            id: 'PRJ-001',
            identity: {
                projectId: 'PRJ-2025-001',
                namaProject: 'Migrasi Cloud',
                clientId: 'C001',
                clientName: 'Bank Mandiri',
                scopeProject: 'Migrasi',
                startDate: '2025-01-01',
                endDate: '2025-06-01',
                projectManagerId: 'EMP-001',
                projectManagerName: 'Dewi',
                status: 'on_progress'
            },
            documentRelations: {
                proposalIds: [],
                quotationIds: [],
                purchaseOrderIds: [],
                invoiceIds: [],
                bastIds: []
            },
            finance: {
                income: 100,
                expense: 50,
                profitLoss: 50
            },
            documents: []
        }
    ];

    test.beforeEach(async ({ page }) => {
        await page.route('*/**/api/projects', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockProjects),
            });
        });

        await page.route('*/**/api/projects/PRJ-001', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockProjects[0]),
            });
        });
    });

    test('should list projects', async ({ page }) => {
        await page.goto('/projects');
        await expect(page.getByText('PRJ-2025-001')).toBeVisible();
        await expect(page.getByText('Migrasi Cloud')).toBeVisible();
    });
});
