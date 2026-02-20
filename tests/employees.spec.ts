import { test, expect } from '@playwright/test';

test.describe('Employees Module', () => {
    const mockEmployees = [
        {
            id: 'EMP-001',
            nik: '2024001',
            namaKaryawan: 'Achmad Hakim',
            namaJabatan: 'DIREKTUR',
            email: 'achmadhakim@gmail.com',
            noHp: '081234567890',
            statusPajak: 'K/2',
            statusPerkawinan: 'Kawin',
            jenisKelamin: 'L',
            tanggalKeluar: null,
        },
        {
            id: 'EMP-002',
            nik: '2024002',
            namaKaryawan: 'Budi Santoso',
            namaJabatan: 'Project Manager',
            email: 'budi@gmail.com',
            noHp: '081234567891',
            statusPajak: 'TK/0',
            statusPerkawinan: 'Belum Kawin',
            jenisKelamin: 'L',
            tanggalKeluar: null,
        },
    ];

    test.beforeEach(async ({ page }) => {
        // Mock API response
        await page.route('*/**/api/employees*', async (route) => {
            const url = new URL(route.request().url());
            if (url.searchParams.get('page')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        data: mockEmployees,
                        total: 2,
                        page: 1,
                        limit: 10,
                        totalPages: 1,
                    }),
                });
            } else {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockEmployees),
                });
            }
        });

        // Mock specific employee
        await page.route('*/**/api/employees/EMP-001', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockEmployees[0]),
            });
        });

        // Mock positions for dropdowns
        await page.route('*/**/api/positions', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 'POS-001', name: 'DIREKTUR', isActive: true },
                    { id: 'POS-002', name: 'Project Manager', isActive: true }
                ])
            })
        })
    });

    test('should list employees', async ({ page }) => {
        await page.goto('/hr/employees');
        await expect(page.getByText('Achmad Hakim')).toBeVisible();
        await expect(page.getByText('DIREKTUR')).toBeVisible();
        await expect(page.getByText('Budi Santoso')).toBeVisible();
    });

    // Add more tests for create, update, delete interactions
});
