import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// Zona horaria fija: las fechas (`formatDay`, días de Entrenamiento) dan igual en cualquier máquina.
// Se define antes de que arranquen los workers de Vitest, que la heredan.
process.env.TZ = 'America/Argentina/Buenos_Aires'

/** Tests unitarios del client (nota 71). Reusa la config de Vite, así que el alias `@/` funciona igual. */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      css: false,
    },
  }),
)
