import { test, expect } from "@playwright/test";
import { injectAuthToken } from "../helpers/auth";

const mockAuth = {
  id: "1",
  username: "admin",
  email: "admin@test.com",
  fullName: "Admin User",
  role: { code: "SUPER_ADMIN", permissionKeys: ["dashboard"] },
};

test.describe("Profile & Settings", () => {
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

  test("profile should load", async ({ page }) => {
    await page.route("**/api/settings*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ theme: "system", language: "id" }),
      });
    });
    await page.goto("/profile");
    await expect(page).toHaveURL("/profile");
    await expect(page.getByText(/profile|account/i)).toBeVisible({ timeout: 10000 });
  });

  test("settings should load", async ({ page }) => {
    await page.route("**/api/settings*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ theme: "system", language: "id" }),
      });
    });
    await page.goto("/settings");
    await expect(page).toHaveURL("/settings");
    await expect(page.getByText(/setting/i)).toBeVisible({ timeout: 10000 });
  });
});
