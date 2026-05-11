import lunisolar from 'lunisolar';

const MONTH_NAMES = ['', '正月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '冬月', '腊月'];
const DAY_NAMES = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                   '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                   '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

export function toLunar(year: number, month: number, day: number): string {
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const lsr = lunisolar(dateStr);
  const lunar = lsr.lunar;

  const monthName = lunar.isLeapMonth ? '闰' : '';
  const monthNum = lunar.month % 100;
  const dayNum = lunar.day;

  return `${monthName}${MONTH_NAMES[monthNum]}${DAY_NAMES[dayNum]}【${lunar.year}年】`;
}

export function toSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeapMonth = false): string | null {
  try {
    const result = lunisolar.fromLunar({
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      isLeapMonth,
    });

    if (!result) return null;

    return result.format('YYYY-MM-DD');
  } catch {
    return null;
  }
}
