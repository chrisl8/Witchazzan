import { test, expect } from '@playwright/test';

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

test.setTimeout(120000);

test('test', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await delay(1000);
  // await page.goto('http://localhost:3001/sign-in.html');
  // await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('test');
  // await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByLabel('Disable sound').check();
  await page.getByRole('button', { name: 'Start Game' }).click();
  await delay(2000);
  await page.keyboard.down('h');
  await delay(10);
  await page.keyboard.up('h');

  const fadingDiv = page.locator('#fading_text_overlay_div');
  await expect(fadingDiv).toHaveText('welcome here');
  await expect(fadingDiv).toHaveText('Use F11 to play in full screen!', {
    timeout: 60 * 1000,
  });
  // #fading_text_overlay_div.fade {
  //   opacity: 0;
  //   visibility: hidden;
  // }
  await expect(fadingDiv).toHaveCSS('opacity', '0', {
    timeout: 60 * 1000,
  });
  await expect(fadingDiv).toHaveCSS('visibility', 'hidden', {
    timeout: 60 * 1000,
  });
  await delay(1000);
  await expect(page).toHaveScreenshot({ maxDiffPixels: 1000 });
  await page.keyboard.down('d');
  await delay(4 * 1000);
  await page.keyboard.up('d');
  await delay(1000);
  await expect(page).toHaveScreenshot({ maxDiffPixels: 1000 });
  await page.keyboard.down('w');
  await delay(7 * 1000);
  await page.keyboard.up('w');
  await expect(page).toHaveScreenshot({ maxDiffPixels: 1000 });
});
