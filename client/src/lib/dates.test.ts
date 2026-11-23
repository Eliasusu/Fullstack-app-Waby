import { describe, expect, it } from 'vitest'
import { formatDay, fromDateOnly, toDateOnly } from './dates'

describe('fechas', () => {
    it('toDateOnly da YYYY-MM-DD en hora local', () => {
        expect(toDateOnly(new Date(2026, 10, 2, 23, 30))).toBe('2026-11-02')
    })

    it('fromDateOnly arma la medianoche local, sin correrse de día', () => {
        const date = fromDateOnly('2026-11-02')
        expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([2026, 10, 2, 0])
    })

    it('formatDay acepta un Date o un YYYY-MM-DD', () => {
        expect(formatDay('2026-11-02')).toBe(formatDay(new Date(2026, 10, 2)))
        expect(formatDay('2026-11-02')).toMatch(/^2 nov/)
    })
})
