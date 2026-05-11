---
status: complete
phase: 08-input-form
source: 08-01-SUMMARY.md
started: 2026-05-11T07:00:00Z
updated: 2026-05-11T07:30:00Z
---

## Current Test

[testing complete]

## Tests

### 1. BaziForm renders with two-row layout
expected: Page shows form with two rows: Row 1 (year/month/day + gender + button), Row 2 (calendar toggle + time mode toggle), name below
result: pass

### 2. 公历/农历 toggle switch
expected: Toggle between 公历/农历 changes calendar mode. In 农历 mode, a "闰月" checkbox appears next to month
result: pass

### 3. Time mode segmented control
expected: Selecting 精确时间 shows hour+minute inputs, selecting 时辰 shows dropdown, selecting 不知道 hides time inputs
result: pass

### 4. Validation disables button
expected: [排盘] button disabled when year out of range (1900-2100), month/day invalid, or gender unselected. Button only enables when all valid
result: pass

### 5. Name field optional
expected: Name field has placeholder "留空将自动生成", can be left empty without validation error
result: pass

### 6. 排盘 button triggers calculation
expected: Clicking [排盘] with valid inputs shows 公历/农历/四柱 results below form
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
