import { test, expect } from "@playwright/test";
import { injectAuthToken } from "../helpers/auth";

const mockAuth = {
  id: "1",
  username: "admin",
  role: { code: "SUPER_ADMIN", permissionKeys: ["dashboard", "finance"] },
};

test.describe("Finance Pages", () => {
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

  test("finance accounting should load", async ({ page }) => {
    await page.route("**/api/finance/overview*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ totalRevenue: 0, totalExpenses: 0, balance: 0 }),
      });
    });
    await page.goto("/finance/accounting");
    await expect(page).toHaveURL("/finance/accounting");
    await expect(page.getByRole("heading", { name: /accounting|finance/i })).toBeVisible({ timeout: 10000 });
  });

  test("finance invoice should load", async ({ page }) => {
    await page.route("**/api/invoices*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/finance/invoice");
    await expect(page).toHaveURL("/finance/invoice");
    await expect(page.getByText(/invoice/i)).toBeVisible({ timeout: 10000 });
  });

  test("finance payment should load", async ({ page }) => {
    await page.route("**/api/finance/payments*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [], total: 0 }),
      });
    });
    await page.route("**/api/finance/payments/overview*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ total: 0, pending: 0 }),
      });
    });
    await page.goto("/finance/payment");
    await expect(page).toHaveURL("/finance/payment");
    await expect(page.getByText(/payment/i)).toBeVisible({ timeout: 10000 });
  });

  test("finance purchase-orders should load", async ({ page }) => {
    await page.route("**/api/purchase-orders*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/finance/purchase-orders");
    await expect(page).toHaveURL("/finance/purchase-orders");
    await expect(page.getByText(/purchase order|po/i)).toBeVisible({ timeout: 10000 });
  });

  test("finance clients should load", async ({ page }) => {
    await page.route("**/api/clients*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/finance/clients");
    await expect(page).toHaveURL("/finance/clients");
    await expect(page.getByText(/client/i)).toBeVisible({ timeout: 10000 });
  });

  test("finance vendors should load", async ({ page }) => {
    await page.route("**/api/vendors*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/finance/vendors");
    await expect(page).toHaveURL("/finance/vendors");
    await expect(page.getByText(/vendor/i)).toBeVisible({ timeout: 10000 });
  });

  test("finance quotations should load", async ({ page }) => {
    await page.route("**/api/quotations*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/finance/quotations");
    await expect(page).toHaveURL("/finance/quotations");
    await expect(page.getByText(/quotation/i)).toBeVisible({ timeout: 10000 });
  });

  test("finance proposal-penawaran should load", async ({ page }) => {
    await page.route("**/api/proposals*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/finance/proposal-penawaran");
    await expect(page).toHaveURL("/finance/proposal-penawaran");
    await expect(page.getByText(/proposal|penawaran/i)).toBeVisible({ timeout: 10000 });
  });

  test("finance perpajakan should load", async ({ page }) => {
    await page.route("**/api/tax-types*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/finance/perpajakan");
    await expect(page).toHaveURL("/finance/perpajakan");
    await expect(page.getByText(/perpajakan|pajak|tax/i)).toBeVisible({ timeout: 10000 });
  });

  test("finance bast should load", async ({ page }) => {
    await page.route("**/api/basts*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/finance/bast");
    await expect(page).toHaveURL("/finance/bast");
    await expect(page.getByText(/bast/i)).toBeVisible({ timeout: 10000 });
  });
});
