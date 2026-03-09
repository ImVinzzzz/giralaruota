import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        # Create a new context with a mobile viewport
        context = await browser.new_context(
            viewport={'width': 414, 'height': 896},
            user_agent='Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
        )
        page = await context.new_page()
        # Go to the local server
        await page.goto("http://localhost:8000")

        # Take a screenshot of start screen
        await page.screenshot(path="mobile_start_screen_fixed.png")

        # Click to go to next screen
        await page.click("body")
        await page.wait_for_timeout(500)

        # Now at setup screen
        await page.screenshot(path="mobile_setup_screen_fixed.png")

        # Click "INIZIA IL GIOCO!" to go to game screen
        await page.click("button:has-text('INIZIA IL GIOCO!')")
        await page.wait_for_timeout(500)

        await page.screenshot(path="mobile_game_screen_fixed.png")

        await browser.close()

asyncio.run(run())
