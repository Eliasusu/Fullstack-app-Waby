import { test as base, expect, type Page } from '@playwright/test';
import { DEMO } from './demo.js';

/**
 * `test` de los smoke tests: toma la URL del client que levantó global-setup.ts
 * y suma `loginAsDemo` para no repetir el login en cada archivo.
 */
export const test = base.extend<{ loginAsDemo: () => Promise<void> }>({
    baseURL: async ({}, use) => {
        const url = process.env.E2E_BASE_URL;
        if (!url) throw new Error('Falta E2E_BASE_URL: los tests se corren con `pnpm test:e2e`.');
        await use(url);
    },
    loginAsDemo: async ({ page }, use) => {
        await use(async () => {
            await login(page, DEMO.username, DEMO.password);
            await expect(page).toHaveURL(/\/home$/);
        });
    },
});

export { expect };

export async function login(page: Page, username: string, password: string) {
    await page.goto('/login');
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
}

/**
 * Lunes de esta semana. El seed arma Entrenamientos del Mesociclo los lunes, miércoles y viernes
 * desde el lunes de la semana pasada, así que este lunes siempre tiene uno.
 */
export function mondayOfThisWeek(now = new Date()) {
    const monday = new Date(now);
    monday.setHours(10, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return monday;
}
