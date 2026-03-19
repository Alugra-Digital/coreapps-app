/**
 * Injects a valid token into localStorage so the app treats the user as authenticated.
 * Must be called before page.goto() for protected routes.
 */
export async function injectAuthToken(page: { addInitScript: (fn: () => void) => Promise<void> }) {
  await page.addInitScript(() => {
    localStorage.setItem("coreapps_token", "test-token-e2e");
  });
}
