import { defineConfig, devices } from "@playwright/test";

const env = "DATABASE_URL=file:./e2e.db ADMIN_PASSWORD=e2e-password SESSION_SECRET=e2e-session-secret-at-least-32-characters";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: {
    command: `${env} ./node_modules/.bin/tsx scripts/prepare-db.ts && ${env} ./node_modules/.bin/next dev`,
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
});
