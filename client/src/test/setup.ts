// Matchers de Testing Library para `expect` (toBeInTheDocument, toHaveTextContent...).
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Desmonta lo renderizado entre tests, así no se mezclan los DOM.
afterEach(() => {
    cleanup()
})
