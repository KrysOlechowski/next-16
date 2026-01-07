import { test, expect } from "@playwright/test";

const navLinks = [
  { href: "/api-test", label: "/api-test" },
  { href: "/devcat", label: "/devcat" },
  { href: "/dynamic/1", label: "/dynamic/[id]" },
  { href: "/game", label: "/game" },
  { href: "/playground", label: "/playground" },
];

test.describe("Home page", () => {
  test("renders hero and fishki section", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Home Page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Fishki" })).toBeVisible();
    await expect(page.getByText("cease", { exact: true })).toBeVisible();
    await expect(page.getByText("przerwać", { exact: true })).toBeVisible();
  });

  test("shows navigation links", async ({ page }) => {
    await page.goto("/");

    for (const { href, label } of navLinks) {
      const link = page.getByRole("link", { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
    }
  });
});
