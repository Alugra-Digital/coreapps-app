import { test, expect } from "@playwright/test";
import { injectAuthToken } from "../helpers/auth";

const mockAuth = {
  id: "1",
  username: "admin",
  role: { code: "SUPER_ADMIN", permissionKeys: ["dashboard", "finance", "hr"] },
};

test.describe("Inventory, Projects, Sales", () => {
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

  test("inventory should load", async ({ page }) => {
    await page.route("**/api/inventory*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/inventory");
    await expect(page).toHaveURL("/inventory");
    await expect(page.getByText(/inventory|stock/i)).toBeVisible({ timeout: 10000 });
  });

  test("projects should load", async ({ page }) => {
    await page.route("**/api/projects*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
    await page.goto("/projects");
    await expect(page).toHaveURL("/projects");
    await expect(page.getByText(/project/i)).toBeVisible({ timeout: 10000 });
  });

  test("sales should load", async ({ page }) => {
    await page.route("**/api/analytics/sales*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [], labels: [] }),
      });
    });
    await page.goto("/sales");
    await expect(page).toHaveURL("/sales");
    await expect(page.getByText(/sales/i)).toBeVisible({ timeout: 10000 });
  });

});
