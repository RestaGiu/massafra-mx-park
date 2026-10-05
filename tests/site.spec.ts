import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("generated media renders and gallery lightbox navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/it");
  await expect(page.locator(".media-placeholder")).toHaveCount(0);
  for (const selector of [
    ".hero-media",
    ".track-0",
    ".track-1",
    ".track-2",
    ".rental-art",
    ".booking-photo",
    ".race-feature",
    ".team-story",
  ]) {
    const image = page.locator(`${selector} img`).first();
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (el) =>
            (el as HTMLImageElement).complete &&
            (el as HTMLImageElement).naturalWidth > 0,
        ),
      )
      .toBeTruthy();
  }
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "reports/with-images-desktop.png" });
  await page.locator(".gallery-item").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".lightbox-controls")).toContainText("1 / 6");
  await page.getByRole("button", { name: "Successiva", exact: true }).click();
  await expect(page.locator(".lightbox-controls")).toContainText("2 / 6");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".gallery-item").first()).toBeFocused();
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/en");
  await expect(page.locator(".hero-media img")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".hero-media img")
        .evaluate((el) => (el as HTMLImageElement).naturalWidth > 0),
    )
    .toBeTruthy();
  await page.screenshot({ path: "reports/with-images-mobile.png" });
});

for (const width of [360, 768, 1280, 1920]) {
  test(`responsive and accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 800 : 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/it");
    await expect(page.locator("h1")).toHaveText("DIVENTAPROTAGONISTA.");
    await expect(
      page.locator(".hero-actions .button").first(),
    ).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    for (const id of [
      "park",
      "noleggio",
      "prenota",
      "gare",
      "galleria",
      "team",
      "dove",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
    }
    await page.locator("#hero").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `reports/it-${width}.png`, fullPage: true });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("English, language section preservation and preference cookie", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/it#noleggio");
  await page.locator('.site-header .languages a[lang="en"]').click();
  await expect(page).toHaveURL(/\/en#noleggio/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveText("BE THEMAIN EVENT.");
  await expect(page.locator("#noleggio")).toBeInViewport();
  expect(
    (await context.cookies()).find((c) => c.name === "NEXT_LOCALE")?.value,
  ).toBe("en");
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test("booking validation and localized WhatsApp message without sending", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en#prenota");
  await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
  await expect(page.locator("#name-error")).toBeVisible();
  await expect(page.locator("#name")).toBeFocused();
  await page.getByLabel("Name", { exact: true }).fill("Test Rider");
  await page.getByLabel("Phone", { exact: true }).fill("+39 333 123 4567");
  await page.getByLabel("Date", { exact: true }).fill("2099-06-20");
  await page.getByLabel("Category", { exact: true }).selectOption("Enduro");
  await page.getByLabel("Number of people").fill("2");
  await page.getByLabel("Your message").fill("Equipment & availability?");
  let outbound = "";
  await context.route("https://wa.me/**", (route) => {
    outbound = route.request().url();
    return route.abort();
  });
  await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
  await expect(page.locator(".form-success")).toContainText("Message ready");
  await expect.poll(() => outbound).toContain("wa.me/393450309633");
  const message = new URL(outbound).searchParams.get("text");
  expect(message).toContain("Test Rider");
  expect(message).toContain("Category: Enduro");
  expect(message).toContain("Need a bike?: Yes, a rental");
  expect(message).toContain("Number of people: 2");
  expect(message).toContain("Equipment & availability?");
  await page.locator("#date").fill("2020-01-01");
  await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
  await expect(page.locator("#date-error")).toBeVisible();
});

test("mobile menu focus, dismissal, map opt-in and legal routes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/it");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Apri menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Apri menu" })).toBeFocused();
  await page.getByRole("button", { name: "Apri menu" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Gare", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#gare")).toBeInViewport();
  await page.route("https://maps.google.com/**", (route) =>
    route.fulfill({ status: 200, body: "Map test" }),
  );
  await page.getByRole("button", { name: "Carica la mappa" }).click();
  await expect(page.locator("iframe")).toHaveCount(1);
  for (const locale of ["it", "en"])
    for (const policy of ["privacy", "cookies"]) {
      const response = await page.goto(`/${locale}/${policy}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toContainText(
        policy === "privacy" ? "PRIVACY" : "COOKIE",
      );
    }
});

test("content survives without JavaScript and SEO resources resolve", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 360, height: 800 },
  });
  const page = await context.newPage();
  await page.goto("/it");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".hero-actions .button").first()).toBeVisible();
  await expect(page.locator(".intro-loader")).toBeHidden();
  const ld = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(ld["@graph"][0]["@type"]).toBe("SportsActivityLocation");
  expect(ld["@graph"][0].address.addressLocality).toBe("Ginosa");
  expect(ld["@graph"][0]).not.toHaveProperty("geo");
  for (const path of [
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/icon.svg",
    "/opengraph-image",
  ])
    expect((await request.get(path)).status()).toBe(200);
  await context.close();
});

test("desktop motion starts, can pause, reduced motion remains readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/it");
  await expect(page.locator(".intro-loader")).toBeHidden({ timeout: 2000 });
  await page.waitForTimeout(1400);
  const before = await page
    .locator(".marquee-track")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(250);
  expect(
    await page
      .locator(".marquee-track")
      .evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe(before);
  await page.getByRole("button", { name: "Pausa animazioni" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await expect(page.locator("h1")).toBeVisible();
});
