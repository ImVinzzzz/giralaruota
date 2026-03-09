import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # iPhone 12 Pro dimensions
        context = await browser.new_context(viewport={'width': 390, 'height': 844})
        page = await context.new_page()

        await page.goto("http://localhost:8000")

        # Click the logo screen to go to players screen
        await page.wait_for_selector("#screen-logo.active", timeout=5000)
        await page.click("#screen-logo")

        # Wait for players screen
        await page.wait_for_selector("#screen-players.active", timeout=5000)

        # Click the INIZIA IL GIOCO! button
        await page.click("button:has-text('INIZIA IL GIOCO!')")

        # Wait for transition screen
        await page.wait_for_selector("#screen-transition.active", timeout=5000)

        # We are at round announcement. Click GIOCHIAMO!
        await page.click("button:has-text('GIOCHIAMO!')")

        # Wait for game screen
        await page.wait_for_selector("#screen-game.active", timeout=5000)

        # Wait a bit for transition
        await page.wait_for_timeout(2000)

        # Take a screenshot of the main game layout
        await page.screenshot(path="mobile_main_game_layout.png", full_page=True)

        await browser.close()

asyncio.run(run())
