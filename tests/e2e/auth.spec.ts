import { test, expect } from "@playwright/test";

test.describe("Auth", () => {
  test("should show login page when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect to dashboard after login", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          token: "test-token",
          user: { id: 1, username: "admin", role: "SUPER_ADMIN" },
        }),
      });
    });
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

    await page.goto("/login");
    await page.getByPlaceholder("Enter your username").fill("admin");
    await page.getByPlaceholder("••••••••").fill("admin123");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page).toHaveURL(/\/(dashboard|$)/, { timeout: 5000 });
  });
});
