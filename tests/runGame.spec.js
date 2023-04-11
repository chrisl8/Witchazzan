import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

test.setTimeout(60000);

const testPlayerUUID = randomUUID();

async function pressKey(key, page) {
  await page.keyboard.down(key);
  await delay(100); // Keys don't register if there is not a delay.
  await page.keyboard.up(key);
  await delay(100);
}

async function moveToLocation({ page, direction, position, changeScenes }) {
  let keyText;
  let coordinatesIndex = 0;
  let compareOptionIsGreaterThan;
  switch (direction) {
    case 'up':
      keyText = 'w';
      coordinatesIndex = 1;
      break;
    case 'down':
      keyText = 's';
      coordinatesIndex = 1;
      compareOptionIsGreaterThan = true;
      break;
    case 'left':
      keyText = 'a';
      break;
    case 'right':
      keyText = 'd';
      compareOptionIsGreaterThan = true;
      break;
    default:
      keyText = '';
      break;
  }

  if (changeScenes) {
    compareOptionIsGreaterThan = !compareOptionIsGreaterThan;
  }

  await expect(async () => {
    await page.keyboard.down(keyText);
    const result = await page
      .locator('#coordinates_text_overlay_div')
      .allInnerTexts();
    if (compareOptionIsGreaterThan) {
      expect(Number(result[0].split(',')[coordinatesIndex])).toBeGreaterThan(
        position,
      );
    } else {
      expect(Number(result[0].split(',')[coordinatesIndex])).toBeLessThan(
        position,
      );
    }
  }).toPass({
    intervals: [1],
    timeout: 30_000,
  });
  await page.keyboard.up(keyText);
}

test('Witchazzan Game Test', async ({ page }) => {
  // Open site
  await page.goto('http://localhost:3001/');
  await delay(1000);

  // Create a new user
  await page.getByRole('button', { name: 'Create New Account' }).click();
  await expect(
    page.getByRole('button', { name: 'Create Account' }),
  ).toBeVisible();
  await expect(
    page.getByLabel('Repeat Password', { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel('Name', { exact: true })
    .fill(`Playwright Tester ${testPlayerUUID}`);
  await page.getByLabel('Password', { exact: true }).fill('test1234');
  await page.getByLabel('Repeat Password', { exact: true }).fill('test1234');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await delay(500);

  // Log in as that user
  await page.getByRole('button', { name: 'Login' }).click();

  // Start Game as that user
  await page.getByRole('button', { name: 'Start Game' }).click();

  const fadingDiv = page.locator('#fading_text_overlay_div');
  await expect(fadingDiv).toHaveText('welcome here');
  await expect(fadingDiv).toHaveText('Use F11 to play in full screen!', {
    timeout: 60 * 1000,
  });

  await expect(fadingDiv).toHaveCSS('opacity', '0', {
    timeout: 60 * 1000,
  });
  await expect(fadingDiv).toHaveCSS('visibility', 'hidden', {
    timeout: 60 * 1000,
  });

  await pressKey('/', page);
  await page.keyboard.type('coordinates');
  await delay(100);
  await page.keyboard.press('Enter');
  await delay(100);
  await page.keyboard.press('Escape');
  await delay(100);

  await expect(page.locator('#coordinates_text_overlay_div')).toHaveText(
    '208,143',
  );

  // TODO: Should we add and set an option to slow the player down during testing?

  await moveToLocation({ page, direction: 'right', position: 260 });
  await delay(1000);
  await expect(page).toHaveScreenshot({ maxDiffPixels: 1000 });

  await moveToLocation({
    page,
    direction: 'up',
    position: 144,
    changeScenes: true,
  });
  await delay(1000);
  await expect(page).toHaveScreenshot({ maxDiffPixels: 1000 });

  // Pause game
  await page.keyboard.down('p');
  await delay(100); // Keys don't register if there is not a delay.
  await page.keyboard.up('p');

  // Delete account
  await page.getByRole('button', { name: 'Delete Account' }).click();
  await expect(page.getByLabel('Your Password', { exact: true })).toBeVisible();
  await page.getByLabel('Your Password', { exact: true }).fill('test1234');
  await page
    .getByRole('button', { name: 'Permanently DELETE my Account' })
    .click();

  await delay(1000);
  await expect(page.getByLabel('Name', { exact: true })).toHaveText('');
  await expect(page.getByLabel('Password', { exact: true })).toHaveText('');
});
