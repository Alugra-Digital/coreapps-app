import { test, expect } from "@playwright/test";
import { injectAuthToken } from "../helpers/auth";

const mockAuth = {
  id: "1",
  username: "admin",
  role: { code: "SUPER_ADMIN", permissionKeys: ["dashboard", "hr", "access_control"] },
};

test.describe("HR & Access Control", () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToken(page);
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockAuth),
      });
    });
  });

  test("hr employees should load", async ({ page }) => {
    await page.route("**/api/employees*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 }),
      });
    });
    await page.goto("/hr/employees");
    await expect(page).toHaveURL("/hr/employees");
    await expect(page.getByText(/employee|karyawan/i)).toBeVisible({ timeout: 10000 });
  });

  test("hr positions should load", async ({ page }) => {
    await page.route("**/api/positions*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/hr/positions");
    await expect(page).toHaveURL("/hr/positions");
    await expect(page.getByText(/position|jabatan/i)).toBeVisible({ timeout: 10000 });
  });

  test("access-control roles should load", async ({ page }) => {
    await page.route("**/api/roles*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/access-control/roles");
    await expect(page).toHaveURL("/access-control/roles");
    await expect(page.getByText(/role/i)).toBeVisible({ timeout: 10000 });
  });

  test("access-control users should load", async ({ page }) => {
    await page.route("**/api/users*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [], total: 0 }),
      });
    });
    await page.goto("/access-control/users");
    await expect(page).toHaveURL("/access-control/users");
    await expect(page.getByText(/user/i)).toBeVisible({ timeout: 10000 });
  });

  test("access-control access-roles should load", async ({ page }) => {
    await page.route("**/api/roles*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/access-control/access-roles");
    await expect(page).toHaveURL("/access-control/access-roles");
    await expect(page.getByText(/access|role|matrix/i)).toBeVisible({ timeout: 10000 });
  });
});
