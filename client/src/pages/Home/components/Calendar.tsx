import { Calendar } from "@/components/ui/calendar"
import BoxContainer from "@/components/ui/BoxConteiner.tsx"
import React from "react"
import { gridBoxWidth } from "@/lib/layout.ts"

export function CalendarHome() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <BoxContainer width={gridBoxWidth} height="" padding="my-5">
      <h2 className="text-2xl font-medium m-5 text-gray-100">Calendar</h2>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md shadow"
      />
    </BoxContainer>
  )
}
