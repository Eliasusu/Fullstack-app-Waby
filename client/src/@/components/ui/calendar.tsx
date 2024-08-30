import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/@/components/ui/button.tsx"
import BoxContainer from "@/@/components/ui/BoxConteiner.tsx"
import { CardContent, CardHeader, CardTitle } from "./card.tsx"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <BoxContainer width="max-w-md" height="" padding="p-2 my-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle title="Calendar" className="text-lx font-medium">Calendar</CardTitle>
      </CardHeader>
      <CardContent className="max-w-screen-sm">
        <DayPicker
          showOutsideDays={showOutsideDays}
          className={cn("p-2", className)}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-2 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-10 rounded-2xl"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-gray-500 rounded-xl w-9 font-normal text-[0.8rem] dark:text-gray-400",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-xl [&:has([aria-selected].day-outside)]:bg-red/50 [&:has([aria-selected])]:bg-red first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50 dark:[&:has([aria-selected])]:bg-redHover",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 w-9 p-0 font-normal rounded-2xl"
            ),
            day_range_end: "day-range-end",
            day_selected:
              "bg-gray-900 text-gray-50 hover:bg-gray-900 hover:text-gray-50 focus:bg-gray-900 focus:text-gray-50 dark:bg-red dark:text-gray-900 dark:hover:bg-redHover dark:hover:text-gray-900 dark:focus:bg-redHover dark:focus:text-gray-900",
            day_today: "bg-red text-white/80 dark:bg-red dark:text-gray-50",
            day_outside:
              "day-outside text-gray-500 opacity-50 aria-selected:bg-red/50 aria-selected:text-gray-500 aria-selected:opacity-30 dark:text-gray-400 dark:aria-selected:bg-gray-800/50 dark:aria-selected:text-gray-400",
            day_disabled: "text-gray-500 opacity-50 dark:text-gray-400",
            day_range_middle:
              "selected:bg-redHover selected:text-gray-900 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            IconLeft: (/*{ ...props }*/) => <ChevronLeft className="h-4 w-4" />,
            IconRight: (/*{ ...props }*/) => <ChevronRight className="h-4 w-4" />,
          }}
          {...props}
        />
      </CardContent>
    </BoxContainer>
    )
  }
Calendar.displayName = "Calendar"

export { Calendar }