"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
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
  const [year, setYear] = useState("2000");
  const [month, setMonth] = useState("1");
  const [day, setDay] = useState("1");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("0");
  const [shichen, setShichen] = useState("子");
  const [name, setName] = useState("");

  function isFormValid(): boolean {
    const yearNum = Number(year);
    const monthNum = Number(month);
    const dayNum = Number(day);

    if (!year || isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) return false;
    if (!month || isNaN(monthNum) || monthNum < 1 || monthNum > 12) return false;
    if (!day || isNaN(dayNum) || dayNum < 1 || dayNum > 31) return false;
    if (!gender) return false;

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
      if (hour === "unknown") {
        input.timeMode = "unknown";
      } else {
        input.hour = parseInt(hour);
        input.minute = parseInt(minute);
      }
    } else if (timeMode === "shichen") {
      if (shichen === "unknown") {
        input.timeMode = "unknown";
      } else {
        input.shichen = shichen;
      }
    }

    onCalculate(input);
  }

  const isValid = isFormValid();

  function disabledReasons(): string[] {
    const reasons: string[] = [];
    const y = Number(year), m = Number(month), d = Number(day);
    if (!year || isNaN(y) || y < 1900 || y > 2100) reasons.push("年份需在 1900–2100");
    if (!month || isNaN(m) || m < 1 || m > 12) reasons.push("月份需在 1–12");
    if (!day || isNaN(d) || d < 1 || d > 31) reasons.push("日期需在 1–31");
    if (!gender) reasons.push("请选择性别");
    return reasons;
  }

  const failingReasons = disabledReasons();
  const yearLabel = calendarMode === "solar" ? "年份" : "年份(农历)";
  const monthLabel = calendarMode === "solar" ? "月份" : "月份(农历)";
  const dayLabel = calendarMode === "solar" ? "日期" : "日期(农历)";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]"
    >
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-[1.2] min-w-[90px]">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">{yearLabel}</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={1900}
            max={2100}
            placeholder="2000"
            className="flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          />
        </div>

        {/* Month */}
        <div className="flex-1 min-w-[50px]">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">{monthLabel}</label>
          <div className="flex gap-1">
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min={1}
              max={12}
              placeholder="1"
              className="flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-base text-[var(--foreground)]"
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
          <input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            min={1}
            max={31}
            placeholder="1"
            className="flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-base text-[var(--foreground)]"
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
              <option value="unknown">不知道</option>
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
              <option value="unknown">不知道</option>
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
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="留空将自动生成"
            className="flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]" />
        </div>

        <div className="relative group">
          <Button type="submit" variant="primary" disabled={!isValid}>
            排盘
          </Button>
          {failingReasons.length > 0 && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
              <div className="bg-[var(--foreground)] text-[var(--background)] text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                {failingReasons.map((r, i) => <div key={i}>{r}</div>)}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--foreground)]" />
            </div>
          )}
        </div>
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
              calendarMode === "lunar" ? "bg-[var(--primary)]" : "bg-[var(--color-warm-stone-300)]"
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
          {(["precise", "shichen"] as TimeMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTimeMode(mode)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeMode === mode
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--color-warm-stone-100)]"
              }`}
            >
              {mode === "precise" ? "时间" : "时辰"}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
