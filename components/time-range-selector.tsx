"use client"

import { Button } from "@/components/ui/button"

interface TimeRangeSelectorProps {
  selected: string
  onSelect: (range: string) => void
}

const ranges = [
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "90D", value: "90" },
  { label: "1Y", value: "365" },
]

export function TimeRangeSelector({ selected, onSelect }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selected === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(range.value)}
          className="min-w-[60px]"
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}
