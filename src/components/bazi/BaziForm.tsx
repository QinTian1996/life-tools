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
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[100px]">
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
        <div className="flex-1 min-w-[80px]">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">{monthLabel}</label>
          <div className="flex gap-2">
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
              <label className="flex items-center gap-1 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isLeapMonth}
                  onChange={(e) => setIsLeapMonth(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border)]"
                />
                <span className="text-sm text-[var(--foreground)]">闰月</span>
              </label>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-[80px]">
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

        <div className="flex-1 min-w-[80px]">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">性别</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
          >
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>

        <Button type="submit" variant="primary" disabled={!isValid} className="min-w-[100px]">
          排盘
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--muted-foreground)]">公历</span>
          <button
            type="button"
            role="switch"
            aria-checked={calendarMode === "lunar"}
            onClick={() => setCalendarMode(calendarMode === "solar" ? "lunar" : "solar")}
            className={`relative inline-block w-11 h-6 rounded-full transition-colors duration-200 ${
              calendarMode === "lunar" ? "bg-[var(--primary)]" : "bg-[var(--muted-foreground)]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                calendarMode === "lunar" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm text-[var(--muted-foreground)]">农历</span>
        </div>

        <div className="w-px h-6 bg-[var(--border)]" />

        <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
          {(["precise", "shichen", "unknown"] as TimeMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTimeMode(mode)}
              className={`px-3 py-1.5 text-sm transition-colors ${
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

      {timeMode === "precise" && (
        <div className="flex gap-4">
          <div className="w-24">
            <label className="block text-sm text-[var(--muted-foreground)] mb-1">小时 (0-23)</label>
            <Input
              type="number"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              min={0}
              max={23}
              className="w-full"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm text-[var(--muted-foreground)] mb-1">分钟 (0-59)</label>
            <Input
              type="number"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              min={0}
              max={59}
              className="w-full"
            />
          </div>
        </div>
      )}

      {timeMode === "shichen" && (
        <div className="max-w-xs">
          <label className="block text-sm text-[var(--muted-foreground)] mb-1">时辰</label>
          <select
            value={shichen}
            onChange={(e) => setShichen(e.target.value)}
            className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
          >
            {SHICHEN_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}时
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="max-w-sm">
        <label className="block text-sm text-[var(--muted-foreground)] mb-1">姓名（选填）</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="留空将自动生成"
          className="w-full"
        />
      </div>
    </form>
  );
}
