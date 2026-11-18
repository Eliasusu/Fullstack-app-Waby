import { expect, test } from '../support/test.js';

test('editar el peso en el Perfil queda guardado', async ({ page, loginAsDemo }) => {
    await loginAsDemo();
    await page.locator('header').getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/profile$/);

    const weight = page.getByPlaceholder('Body Weight');
    const next = String(Number(await weight.inputValue()) + 0.5);
    await weight.fill(next);
    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Your profile has been updated').first()).toBeVisible();

    await page.reload();
    await expect(page.getByPlaceholder('Body Weight')).toHaveValue(next);
});
