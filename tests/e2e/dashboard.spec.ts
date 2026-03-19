import { test, expect } from "@playwright/test";
import { injectAuthToken } from "../helpers/auth";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await injectAuthToken(page);
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "1",
          username: "admin",
          role: { code: "SUPER_ADMIN", permissionKeys: ["dashboard"] },
        }),
      });
    });
  });

  test("should load dashboard when authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible({ timeout: 10000 });
  });
});
