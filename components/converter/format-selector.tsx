"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FormatSelector({ value, formats, onChange }: { value: string; formats: string[]; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={(next) => { if (next) onChange(next); }}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
