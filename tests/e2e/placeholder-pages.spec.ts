import { test, expect } from "@playwright/test";
import { injectAuthToken } from "../helpers/auth";

test.describe("Placeholder Pages", () => {
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

  const placeholderRoutes = [
    { path: "/feedback", title: "Feedback" },
    { path: "/help", title: "Help & Support" },
  ];

  for (const { path, title } of placeholderRoutes) {
    test(`${path} should render without error`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 10000 });
    });
  }
});
