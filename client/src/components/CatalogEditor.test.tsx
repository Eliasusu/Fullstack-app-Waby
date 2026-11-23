import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateMuscleGroupSchema } from '@waby/shared'
import CatalogEditor, { type CatalogEditorProps, type CatalogItem } from './CatalogEditor'

/**
 * Test de componente (nota 84): CatalogEditor recibe datos por props (input) y avisa al padre
 * por callbacks (output). Como no usa contextos ni la API, alcanza con funciones espía.
 */
const items: CatalogItem[] = [
    { id: 1, name: 'Espalda', description: 'Dorsales y trapecio' },
    { id: 2, name: 'Piernas', description: 'Cuádriceps e isquios' },
]

function renderEditor(props: Partial<CatalogEditorProps> = {}) {
    const callbacks = {
        onCreate: vi.fn().mockResolvedValue(true),
        onUpdate: vi.fn().mockResolvedValue(true),
        onDelete: vi.fn().mockResolvedValue(true),
    }
    render(<CatalogEditor title="Grupos musculares" items={items} schema={CreateMuscleGroupSchema} {...callbacks} {...props} />)
    return { user: userEvent.setup(), ...callbacks }
}

/** Formulario de alta: el primero de la sección. */
const createForm = () => within(screen.getAllByRole('textbox', { name: 'Nombre' })[0].closest('form')!)

describe('CatalogEditor', () => {
    it('muestra los elementos que recibe por props', () => {
        renderEditor()
        expect(screen.getByRole('heading', { name: 'Grupos musculares' })).toBeInTheDocument()
        expect(screen.getByText('Espalda')).toBeInTheDocument()
        expect(screen.getByText('Cuádriceps e isquios')).toBeInTheDocument()
    })

    it('sin elementos muestra "Cargando…" o el vacío según loading', () => {
        const { unmount } = render(
            <CatalogEditor title="Métodos" items={[]} loading schema={CreateMuscleGroupSchema} onCreate={vi.fn()} onUpdate={vi.fn()} onDelete={vi.fn()} />,
        )
        expect(screen.getByText('Cargando…')).toBeInTheDocument()
        unmount()
        renderEditor({ items: [] })
        expect(screen.getByText('Todavía no hay elementos.')).toBeInTheDocument()
    })

    it('al agregar avisa al padre con los valores y limpia el form', async () => {
        const { user, onCreate } = renderEditor()
        const form = createForm()
        await user.type(form.getByRole('textbox', { name: 'Nombre' }), 'Antebrazos')
        await user.type(form.getByRole('textbox', { name: 'Descripción' }), 'Flexores de la muñeca')
        await user.click(form.getByRole('button', { name: 'Agregar' }))

        expect(onCreate).toHaveBeenCalledWith({ name: 'Antebrazos', description: 'Flexores de la muñeca' })
        expect(form.getByRole('textbox', { name: 'Nombre' })).toHaveValue('')
    })

    it('con datos inválidos muestra el error y no avisa al padre', async () => {
        const { user, onCreate } = renderEditor()
        await user.click(createForm().getByRole('button', { name: 'Agregar' }))

        expect(screen.getAllByText('Este campo es obligatorio')).toHaveLength(2)
        expect(onCreate).not.toHaveBeenCalled()
    })

    it('al editar avisa al padre con el id y los valores nuevos', async () => {
        const { user, onUpdate } = renderEditor()
        await user.click(screen.getByRole('button', { name: 'Editar Piernas' }))
        const nameInputs = screen.getAllByRole('textbox', { name: 'Nombre' })
        const editName = nameInputs[nameInputs.length - 1]
        await user.clear(editName)
        await user.type(editName, 'Tren inferior')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(onUpdate).toHaveBeenCalledWith(2, { name: 'Tren inferior', description: 'Cuádriceps e isquios' })
    })

    it('pide confirmación antes de avisar que se borra', async () => {
        const { user, onDelete } = renderEditor()
        await user.click(screen.getByRole('button', { name: 'Borrar Espalda' }))
        expect(screen.getByText('¿Borrar Espalda?')).toBeInTheDocument()
        expect(onDelete).not.toHaveBeenCalled()

        await user.click(screen.getByRole('button', { name: 'Cancelar' }))
        expect(onDelete).not.toHaveBeenCalled()

        await user.click(screen.getByRole('button', { name: 'Borrar Espalda' }))
        await user.click(screen.getByRole('button', { name: 'Sí, borrar' }))
        expect(onDelete).toHaveBeenCalledWith(items[0])
    })
})
