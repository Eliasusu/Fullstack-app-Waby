import { Calendar } from "@/components/ui/calendar"
import  BoxContainer  from "@/components/ui/BoxConteiner.tsx"
import React from "react"

export function CalendarHome() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md shadow"
      />
      </BoxContainer>
  )
}
