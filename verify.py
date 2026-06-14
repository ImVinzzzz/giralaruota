from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8000")

    # logo -> players -> transition -> game
    page.click("#screen-logo")
    page.wait_for_selector("#screen-players.active")

    # Select 2 players
    page.select_option("#player-count", "2")
    page.evaluate("updatePlayerInputs()")

    page.click("button:has-text('INIZIA IL GIOCO!')")
    page.wait_for_selector("#screen-transition.active")

    page.click("button:has-text('GIOCHIAMO!')")
    page.wait_for_selector("#screen-game.active")

    # Wait a moment for rendering
    time.sleep(1)

    # Initial state, vowels should be enabled (before any spin, but actually we set phase to 'spin' initially so it should be available)
    # Actually wait, are vowels enabled BEFORE we spin?
    # Yes, phase='spin' initially. Let's see.
    page.screenshot(path="screenshot_1_initial.png", clip={'x': 0, 'y': 0, 'width': 400, 'height': 800})

    # Spin the wheel
    page.click("#btn-spin")

    # Now wheel is spinning, vowels should be disabled
    time.sleep(0.5)
    page.screenshot(path="screenshot_2_spinning.png", clip={'x': 0, 'y': 0, 'width': 400, 'height': 800})

    # Wait for spin to finish (spin duration is 4.2s)
    time.sleep(5)

    # Now it should be in 'guess' phase if it hit a score, or 'passamano', etc.
    # Let's take a screenshot
    page.screenshot(path="screenshot_3_after_spin.png", clip={'x': 0, 'y': 0, 'width': 400, 'height': 800})

    # check class of vowel section
    vowel_disabled = page.evaluate("document.querySelector('.vowel-section').classList.contains('disabled')")
    print(f"Vowel disabled after spin: {vowel_disabled}")

    # If it's a score, phase is 'guess', so vowel is disabled.
    # If we click a consonant, it goes to 'spin' or next player.
    # We don't know the exact result, but we can verify it's disabled while spinning.

    browser.close()
