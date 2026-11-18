import { expect, test } from '../support/test.js';

test.beforeEach(async ({ page, loginAsDemo }) => {
    await loginAsDemo();
    await page.getByRole('link', { name: 'Metas' }).click();
    await expect(page).toHaveURL(/\/goals$/);
});

test('lista las Metas del seed', async ({ page }) => {
    for (const exercise of ['Dominadas lastradas', 'Front lever', 'Fondos en paralelas']) {
        await expect(page.getByRole('cell', { name: exercise, exact: true })).toBeVisible();
    }
});

test('crear una Meta la suma a la tabla', async ({ page }) => {
    const rows = page.getByRole('row').filter({ has: page.getByRole('cell', { name: 'Flexiones', exact: true }) });
    const before = await rows.count();

    await page.getByRole('button', { name: 'Add new goal' }).click();
    const dialog = page.getByRole('dialog', { name: 'New goal' });
    await dialog.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Flexiones' }).click();
    // Un ejercicio por repeticiones admite dos tipos de objetivo: se elige uno.
    await dialog.getByRole('combobox').nth(1).click();
    await page.getByRole('option').first().click();
    await dialog.getByLabel('Goal').fill('30');
    await dialog.getByRole('button', { name: 'Create goal' }).click();

    await expect(dialog).toBeHidden();
    await expect(rows).toHaveCount(before + 1);
});
