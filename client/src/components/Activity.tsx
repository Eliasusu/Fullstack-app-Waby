/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import BoxContainer  from "@/components/ui/BoxConteiner.tsx"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useTraining } from "@/trainings/TrainingContext"
interface ActivityDay  {
  date: Date;
  completed: boolean
}

export default function Activity() {
  const [activityData, setActivityData] = useState<ActivityDay[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("Mensual")
  const { trainings, getTrainings } = useTraining()


  useEffect(() => {
    const interval = setInterval(() => {
      getTrainings()
    }, 60 * 1000)

    getTrainings()

    return () => {
      clearInterval(interval)
    }
  }, [])
  

  useEffect(() => {
    generateActivityData(selectedPeriod)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod])

  const generateActivityData = async (period: string) => {
    const currentDate = new Date()
    let daysToGenerate = 0
    let startDate = new Date()

    switch (period) {
      case "Semanal":
        daysToGenerate = 7
        startDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1))
        break
      case "Mensual":
        daysToGenerate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        break
      case "Anual":
        daysToGenerate = 365
        startDate = new Date(currentDate.getFullYear(), 0, 1)
        break
    }

    const newActivityData: ActivityDay[] = []
    
    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      newActivityData.push({
        date,
        completed: trainings.some(training => {
          const trainingDate = new Date(training.day)
          return trainingDate.toDateString() === date.toDateString() && training.completed
        })
      })
    }

    setActivityData(newActivityData)
  }

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
                      className={`w-2 h-2 rounded-sm ${day.completed ? 'bg-red' : 'bg-grey-boxActivity'}`}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-7 gap-1 mt-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-xs text-center font-medium">{day}</div>
        ))}
        {activityData.map((day, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-sm ${day.completed ? 'bg-red' : 'bg-grey-boxActivity'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <BoxContainer  width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding='my-5'>
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