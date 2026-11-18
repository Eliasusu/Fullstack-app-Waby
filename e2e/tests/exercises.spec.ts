import { expect, test } from '../support/test.js';

test('crear un Ejercicio lo suma a "Tus ejercicios"', async ({ page, loginAsDemo }) => {
    const name = `Remo invertido ${Date.now().toString(36)}`;
    await loginAsDemo();
    await page.getByRole('link', { name: 'Crear' }).click();
    await expect(page).toHaveURL(/\/create$/);

    // El alta se abre desde un grupo muscular.
    await page.getByText('Espalda', { exact: true }).click();
    await page.getByRole('button', { name: 'Add Exercise' }).click();

    const dialog = page.getByRole('dialog', { name: 'Add an exercise' });
    await dialog.getByLabel('Nombre').fill(name);
    await dialog.getByLabel('Descripción').fill('Colgado de la barra baja, pecho a la barra.');
    const pick = async (trigger: string, option: string) => {
        await dialog.getByRole('combobox').filter({ hasText: trigger }).click();
        await page.getByRole('option', { name: option, exact: true }).click();
    };
    await pick('Select method', 'Calistenia');
    // El grupo viene elegido porque el alta se abrió desde "Espalda".
    await expect(dialog.getByRole('combobox').filter({ hasText: 'Espalda' })).toBeVisible();
    await pick('Select difficulty', 'Fácil');
    await pick('Select movement pattern', 'Tracción');
    await pick('Repeticiones o tiempo', 'Repeticiones');
    await dialog.getByRole('button', { name: 'Cargar' }).click();

    await expect(dialog).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('cell', { name })).toBeVisible();
});
