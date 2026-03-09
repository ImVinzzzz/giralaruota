from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Set mobile viewport
    context = browser.new_context(viewport={'width': 375, 'height': 812})
    page = context.new_page()

    # 4 Players
    page.goto("http://localhost:8000")

    page.wait_for_selector("#screen-logo", state="visible")
    page.click("#screen-logo")

    page.wait_for_selector("#player-count")
    page.evaluate("document.getElementById('player-count').value = '4'")
    page.evaluate("updatePlayerInputs()")
    page.evaluate("document.querySelector('.btn-primary').click()")

    page.wait_for_selector(".btn-go", state="visible")
    page.click(".btn-go")

    page.wait_for_selector(".scores-panel", state="visible")
    page.wait_for_timeout(1000)

    # Scroll the g-main to the bottom
    page.evaluate("document.querySelector('.g-main').scrollTop = document.querySelector('.g-main').scrollHeight")
    page.wait_for_timeout(500)

    # Take screenshot of the scores panel
    scores = page.locator(".scores-panel")
    scores.screenshot(path="scores_4_players.png")

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

    page.wait_for_selector(".scores-panel", state="visible")
    page.wait_for_timeout(1000)

    page.evaluate("document.querySelector('.g-main').scrollTop = document.querySelector('.g-main').scrollHeight")
    page.wait_for_timeout(500)

    scores = page.locator(".scores-panel")
    scores.screenshot(path="scores_3_players.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
