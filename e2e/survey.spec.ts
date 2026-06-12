import { expect, test } from "@playwright/test";

test("complete survey, view dashboard, and export Excel", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /色彩，决定/ })).toBeVisible();
  await expect(page.locator('#survey[data-hydrated="true"]')).toBeAttached();

  await page.locator("#question-1").scrollIntoViewIfNeeded();
  await page.getByLabel("26-35岁").check();
  await page.getByLabel("家用").check();
  await expect(page.locator("#question-3").getByText("选填")).toBeVisible();
  await expect(page.locator("#question-4").getByText("选填")).toBeVisible();
  await page.locator("#question-5").getByLabel("蓝色").check();
  await page.locator("#question-6").getByLabel("黑色").check();
  await page.getByRole("button", { name: "黑色下移一名" }).click();
  await page.getByRole("button", { name: "黑色上移一名" }).click();
  await page.locator("#question-8").getByLabel("黑色").check();
  await page.locator("#question-9").getByLabel("红色").check();
  await page.locator("#question-10").getByLabel("白色").check();
  await page.getByRole("button", { name: "提交问卷" }).click();
  await expect(page.getByRole("heading", { name: "感谢参与调研" })).toBeVisible();

  await page.goto("/dashboard/login");
  await page.getByLabel("管理员口令").fill("e2e-password");
  await page.getByRole("button", { name: "进入看板" }).click();
  await expect(page.getByRole("heading", { name: "车色偏好数据" })).toBeVisible();
  await expect(page.getByText("累计有效问卷")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "导出 Excel" }).click();
  expect((await downloadPromise).suggestedFilename()).toContain("车色调研数据");
});
