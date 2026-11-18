import { DEMO } from '../support/demo.js';
import { expect, mondayOfThisWeek, test } from '../support/test.js';

/** El reloj del navegador va al lunes de esta semana, que en el seed tiene "Tirón · semana 2". */
test.beforeEach(async ({ page, loginAsDemo }) => {
    await page.clock.setFixedTime(mondayOfThisWeek());
    await loginAsDemo();
});

test('el Home muestra el Entrenamiento del día con sus Ítems', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tirón · semana 2' })).toBeVisible();
    for (const exercise of ['Dominadas lastradas', 'Front lever', 'Plancha']) {
        await expect(page.getByRole('cell', { name: exercise })).toBeVisible();
    }
});

test('el calendario muestra el Mesociclo, y completar un Ítem persiste al recargar', async ({ page }) => {
    await page.getByRole('link', { name: 'Calendario' }).click();
    await expect(page.getByRole('heading', { name: 'Tirón · semana 2' })).toBeVisible();
    await expect(page.getByText(DEMO.mesocycle)).toBeVisible();

    const row = page.getByRole('row').filter({ has: page.getByRole('button', { name: 'Plancha' }) });
    const checkbox = row.getByRole('checkbox');
    const wasChecked = (await checkbox.getAttribute('aria-checked')) === 'true';
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('aria-checked', String(!wasChecked));

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Tirón · semana 2' })).toBeVisible();
    await expect(row.getByRole('checkbox')).toHaveAttribute('aria-checked', String(!wasChecked));
});
