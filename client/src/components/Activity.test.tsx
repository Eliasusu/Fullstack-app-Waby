import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Training } from '@waby/shared'
import Activity from './Activity'

/**
 * Test de componente: el cuadrado de un día entrenado tiene que caer bajo la columna
 * de su día de la semana, en la vista semanal y en la mensual.
 */
let trainings: Training[] = []

vi.mock('@/trainings/training.context.tsx', () => ({
    useTraining: () => ({ trainings, getTrainings: vi.fn() }),
}))

const training = (day: string): Training =>
    ({ id: 1, name: 'Piernas', day, completed: true }) as Training

/** Etiqueta de la columna en la que cae el único día entrenado de la grilla. */
function columnOfTrainedDay(): string {
    const header = screen.getAllByText('Lun').find(el => el.parentElement?.classList.contains('grid-cols-7'))!
    const cells = Array.from(header.parentElement!.children)
    const headers = cells.slice(0, 7)
    const days = cells.slice(7)
    const index = days.findIndex(el => el.classList.contains('bg-red'))
    expect(index).toBeGreaterThanOrEqual(0)
    return headers[index % 7].textContent!
}

async function choosePeriod(period: string) {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: period }))
}

beforeAll(() => {
    // Radix Select usa APIs de puntero que jsdom no trae.
    Element.prototype.hasPointerCapture = () => false
    Element.prototype.releasePointerCapture = () => {}
    Element.prototype.scrollIntoView = () => {}
})

beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
    vi.useRealTimers()
})

describe('Activity', () => {
    // Fechas elegidas para cubrir meses que empiezan en distintos días de la semana.
    const cases = [
        { today: new Date(2026, 10, 23, 12), day: '2026-11-23', weekday: 'Lun' }, // nov 2026 empieza domingo
        { today: new Date(2026, 10, 1, 12), day: '2026-11-01', weekday: 'Dom' },
        { today: new Date(2026, 3, 15, 12), day: '2026-04-15', weekday: 'Mie' }, // abr 2026 empieza miércoles
        { today: new Date(2026, 5, 6, 12), day: '2026-06-06', weekday: 'Sab' }, // jun 2026 empieza lunes
    ]

    for (const { today, day, weekday } of cases) {
        it(`vista semanal: ${day} cae en ${weekday}`, async () => {
            vi.setSystemTime(today)
            trainings = [training(day)]
            render(<Activity />)
            await choosePeriod('Semanal')
            expect(columnOfTrainedDay()).toBe(weekday)
        })

        it(`vista mensual: ${day} cae en ${weekday}`, () => {
            vi.setSystemTime(today)
            trainings = [training(day)]
            render(<Activity />)
            expect(columnOfTrainedDay()).toBe(weekday)
        })
    }

    it('vista mensual: muestra todos los días del mes, del 1 al último', () => {
        vi.setSystemTime(new Date(2026, 10, 23, 12))
        trainings = [training('2026-11-01'), training('2026-11-30')]
        render(<Activity />)
        expect(screen.getByText('Cantidad de días: 2')).toBeInTheDocument()
    })

    it('vista anual: cuenta del 1 de enero al 31 de diciembre', async () => {
        vi.setSystemTime(new Date(2026, 10, 23, 12))
        trainings = [training('2026-01-01'), training('2026-12-31')]
        render(<Activity />)
        await choosePeriod('Anual')
        expect(screen.getByText('Cantidad de días: 2')).toBeInTheDocument()
    })
})
