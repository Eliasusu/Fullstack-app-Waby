import { expect, test } from '../support/test.js';

// #54: el select muestra un método elegido, pero si no se toca, el formulario lo manda vacío
// y responde "Elegí un método de entrenamiento". Sacar el fixme cuando se arregle.
test.fixme('registro de un usuario nuevo entra a la app', async ({ page }) => {
    const username = `e2e${Date.now().toString(36)}`;

    await page.goto('/register');
    await page.getByPlaceholder('Email').fill(`${username}@waby.local`);
    await page.getByPlaceholder('Password').fill('una-contraseña-segura');
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Full name').fill('Usuaria E2E');
    await page.getByPlaceholder('Birthday').fill('1995-06-15');
    await page.getByPlaceholder('Weight (kg)').fill('62.5');
    await page.getByPlaceholder('Height (cm)').fill('168');
    // El select carga los métodos de la API: se espera a que haya opciones.
    await expect(page.locator('select option')).not.toHaveCount(0);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.locator('header')).toContainText(username);
});
