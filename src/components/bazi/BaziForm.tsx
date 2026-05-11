"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { BirthInput, CalendarMode, Gender, TimeMode } from "@/lib/bazi/types";

const SHICHEN_OPTIONS = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

interface BaziFormProps {
  onCalculate: (input: BirthInput) => void;
}

export function BaziForm({ onCalculate }: BaziFormProps) {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("solar");
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [timeMode, setTimeMode] = useState<TimeMode>("precise");
  const [gender, setGender] = useState<Gender>("male");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("0");
  const [shichen, setShichen] = useState("子");
  const [name, setName] = useState("");

  function isFormValid(): boolean {
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) return false;
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) return false;
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) return false;

    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isFormValid()) return;

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    const input: BirthInput = {
      year: yearNum,
      month: monthNum,
      day: dayNum,
      calendar: calendarMode,
      timeMode,
      gender,
      name: name || undefined,
    };

    if (timeMode === "precise") {
      input.hour = parseInt(hour);
      input.minute = parseInt(minute);
    } else if (timeMode === "shichen") {
      input.shichen = shichen;
    }

    onCalculate(input);
  }

  const isValid = isFormValid();
  const yearLabel = calendarMode === "solar" ? "年份" : "年份(农历)";
  const monthLabel = calendarMode === "solar" ? "月份" : "月份(农历)";
  const dayLabel = calendarMode === "solar" ? "日期" : "日期(农历)";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]"
    >
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[60px]">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">{yearLabel}</label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={1900}
            max={2100}
            placeholder="2000"
            className="w-full"
          />
        </div>

        {/* Month */}
        <div className="flex-1 min-w-[50px]">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">{monthLabel}</label>
          <div className="flex gap-1">
            <Input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min={1}
              max={12}
              placeholder="1"
              className="w-full"
            />
            {calendarMode === "lunar" && (
              <label className="flex items-center gap-1 whitespace-nowrap text-xs">
                <input
                  type="checkbox"
                  checked={isLeapMonth}
                  onChange={(e) => setIsLeapMonth(e.target.checked)}
                  className="w-3 h-3 rounded border-[var(--border)]"
                />
                闰月
              </label>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-[50px]">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">{dayLabel}</label>
          <Input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            min={1}
            max={31}
            placeholder="1"
            className="w-full"
          />
        </div>

        {timeMode === "precise" && (
          <div className="w-[90px]">
            <label className="block text-sm text-[var(--muted-foreground)] mb-1">时间</label>
            <select
              value={`${hour}:${minute}`}
              onChange={(e) => { const [h, m] = e.target.value.split(":"); setHour(h); setMinute(m); }}
              className="w-full h-10 px-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm"
            >
              {Array.from({ length: 48 }, (_, i) => {
                const h = String(Math.floor(i / 2)).padStart(2, "0");
                const m = i % 2 === 0 ? "00" : "30";
                return <option key={`${h}:${m}`} value={`${h}:${m}`}>{h}:{m}</option>;
              })}
            </select>
          </div>
        )}

        {timeMode === "shichen" && (
          <div className="w-[80px]">
            <label className="block text-sm text-[var(--muted-foreground)] mb-1">时辰</label>
            <select
              value={shichen}
              onChange={(e) => setShichen(e.target.value)}
              className="w-full h-10 px-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm"
            >
              {SHICHEN_OPTIONS.map((s) => (<option key={s} value={s}>{s}时</option>))}
            </select>
          </div>
        )}

        <div className="w-[70px]">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">性别</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full h-10 px-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm"
          >
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>

        <div className="flex-[2] min-w-[150px]">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">姓名</label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="留空将自动生成" className="w-full" />
        </div>

        <Button type="submit" variant="primary" disabled={!isValid}>
          排盘
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center border-t border-[var(--border)] pt-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${calendarMode === "solar" ? "text-[var(--primary)] font-medium" : "text-[var(--muted-foreground)]"}`}>公历</span>
          <button
            type="button"
            role="switch"
            aria-checked={calendarMode === "lunar"}
            onClick={() => setCalendarMode(calendarMode === "solar" ? "lunar" : "solar")}
            className={`relative inline-block w-11 h-6 rounded-full transition-colors duration-200 ${
              calendarMode === "lunar" ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                calendarMode === "lunar" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm ${calendarMode === "lunar" ? "text-[var(--primary)] font-medium" : "text-[var(--muted-foreground)]"}`}>农历</span>
        </div>

        <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
          {(["precise", "shichen", "unknown"] as TimeMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTimeMode(mode)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeMode === mode
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
              }`}
            >
              {mode === "precise" ? "精确时间" : mode === "shichen" ? "时辰" : "不知道"}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
