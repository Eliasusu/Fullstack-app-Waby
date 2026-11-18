import { DEMO } from '../support/demo.js';
import { expect, login, test } from '../support/test.js';

test.describe('sesión', () => {
    test('login con demo lleva al Home y saluda al usuario', async ({ page, loginAsDemo }) => {
        await loginAsDemo();
        await expect(page.locator('header')).toContainText(DEMO.username);
    });

    test('login con contraseña incorrecta muestra el error y no entra', async ({ page }) => {
        await login(page, DEMO.username, 'contraseña-incorrecta');
        await expect(page.getByText('Usuario o contraseña incorrectos')).toBeVisible();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('logout vuelve al login y las rutas protegidas redirigen', async ({ page, loginAsDemo }) => {
        await loginAsDemo();
        await page.locator('header').getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Log out' }).click();
        await expect(page).toHaveURL(/\/login$/);

        // Sin sesión, una ruta protegida lleva al login, también recargando.
        await page.goto('/goals');
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    });
});
