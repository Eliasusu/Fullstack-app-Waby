import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke tests de Waby (#72). La URL del client la define global-setup.ts, que levanta
 * MySQL, la API y el client antes de correr. Se corren con `pnpm test:e2e` desde la raíz.
 */
export default defineConfig({
    testDir: './tests',
    globalSetup: './global-setup.ts',
    // Los tests comparten la base del seed: de a uno.
    workers: 1,
    fullyParallel: false,
    retries: 0,
    timeout: 30_000,
    expect: { timeout: 7_000 },
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        // Sin timezoneId: el navegador usa la zona del sistema, igual que el seed al calcular las fechas.
        locale: 'es-AR',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
