import { useState, useEffect, useMemo } from 'react'
import BoxContainer from "@/components/ui/BoxConteiner.tsx"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useTraining } from "@/trainings/training.context.tsx"
import { toDateOnly } from "@/lib/dates.ts"
import type { Training } from "@waby/shared"
import { gridBoxWidth } from "@/lib/layout.ts"
interface ActivityDay {
  date: Date;
  completed: boolean
}

export default function Activity() {
  const [selectedPeriod, setSelectedPeriod] = useState("Mensual")
  const { trainings, getTrainings } = useTraining()

  useEffect(() => {
    getTrainings()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- se carga una sola vez al montar
  }, [])

  // Se recalcula solo si cambia el período o los entrenamientos (nota 55: antes era un efecto sin dependencias que no paraba).
  const activityData = useMemo(() => buildActivityData(selectedPeriod, trainings), [selectedPeriod, trainings])

  const renderActivityGrid = () => {
    const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

    if (selectedPeriod === "Anual") {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      return (
        <div className="grid grid-cols-12 gap-2 mt-2">
          {months.map(month => (
            <div key={month} className="flex flex-col items-center">
              <div className="text-xs font-medium mb-1">{month}</div>
              <div className="grid grid-cols-7 gap-1">
                {activityData
                  .filter(day => day.date.getMonth() === months.indexOf(month))
                  .map((day, index) => (
                    <div
                      key={index}
                      className={`w-1 h-1 rounded-sm ${day.completed ? 'bg-red' : 'bg-grey-boxActivity'}`}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Las semanas empiezan en lunes: celdas vacías hasta la columna del primer día.
    const leadingBlanks = activityData.length > 0 ? mondayBasedWeekday(activityData[0].date) : 0

    return (
      <div className="grid grid-cols-7 gap-1 mt-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-xs text-center font-medium">{day}</div>
        ))}
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <div key={`blank-${index}`} />
        ))}
        {activityData.map((day, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-sm m-auto ${day.completed ? 'bg-red' : 'bg-grey-boxActivity'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <BoxContainer width={gridBoxWidth} height="" padding='my-5'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-medium">Activity</CardTitle>
        <Select
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
        >
          <SelectTrigger className="w-[120px] bg-grey-box">
            <SelectValue placeholder="Seleccionar periodo" />
          </SelectTrigger>
          <SelectContent className="bg-grey-box/80 text-white">
            <SelectItem value="Semanal">Semanal</SelectItem>
            <SelectItem value="Mensual">Mensual</SelectItem>
            <SelectItem value="Anual">Anual</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {renderActivityGrid()}
        <div className="flex items-center mt-4 text-sm">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-red rounded-sm mr-2" />
            <span>Día entrenado</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-600 rounded-sm mr-2" />
            <span>Día no entrenado</span>
          </div>
        </div>
        <div className="mt-4 text-sm">
          Cantidad de días: {activityData.filter(day => day.completed).length}
        </div>
      </CardContent>
    </BoxContainer>
  )
}

/** Día de la semana con el lunes como 0 y el domingo como 6. */
function mondayBasedWeekday(date: Date): number {
  return (date.getDay() + 6) % 7
}

/** Días del período que contiene a hoy: la semana (lunes a domingo), el mes o el año. */
function buildActivityData(period: string, trainings: Training[]): ActivityDay[] {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  let start: Date
  let end: Date

  switch (period) {
    case "Semanal":
      start = new Date(year, month, today.getDate() - mondayBasedWeekday(today))
      end = new Date(year, month, start.getDate() + 6)
      break
    case "Anual":
      start = new Date(year, 0, 1)
      end = new Date(year, 11, 31)
      break
    default: // "Mensual"
      start = new Date(year, month, 1)
      end = new Date(year, month + 1, 0)
  }

  // `day` viene como YYYY-MM-DD: se compara como texto, sin pasar por Date (zona horaria).
  const trainedDays = new Set(trainings.filter(training => training.completed).map(training => training.day))

  const days: ActivityDay[] = []
  for (let date = start; date <= end; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) {
    days.push({ date, completed: trainedDays.has(toDateOnly(date)) })
  }
  return days
}
