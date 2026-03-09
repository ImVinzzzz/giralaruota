from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Set mobile viewport
    context = browser.new_context(viewport={'width': 375, 'height': 812})
    page = context.new_page()

    # 4 Players
    page.goto("http://localhost:8000")

    # Click logo to transition from screen-logo to screen-players
    page.wait_for_selector("#screen-logo", state="visible")
    page.click("#screen-logo")

    page.wait_for_selector("#player-count")
    page.evaluate("document.getElementById('player-count').value = '4'")
    page.evaluate("updatePlayerInputs()")

    # Click INIZIA IL GIOCO
    page.evaluate("document.querySelector('.btn-primary').click()")

    # Wait for the transition screen and click GIOCHIAMO
    page.wait_for_selector(".btn-go", state="visible")
    page.click(".btn-go")

    # Wait for the game screen
    page.wait_for_selector("#board-panel, .center-panel", state="visible")
    page.wait_for_timeout(2000)

    # Take a full page screenshot
    page.screenshot(path="mobile_4_players_full.png", full_page=True)

    # 3 Players
    page.goto("http://localhost:8000")
    page.wait_for_selector("#screen-logo", state="visible")
    page.click("#screen-logo")

    page.wait_for_selector("#player-count")
    page.evaluate("document.getElementById('player-count').value = '3'")
    page.evaluate("updatePlayerInputs()")
    page.evaluate("document.querySelector('.btn-primary').click()")

    page.wait_for_selector(".btn-go", state="visible")
    page.click(".btn-go")

    page.wait_for_selector(".center-panel", state="visible")
    page.wait_for_timeout(2000)

    page.screenshot(path="mobile_3_players_full.png", full_page=True)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
