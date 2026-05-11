import lunisolar from 'lunisolar';
import { toSolar, toLunar } from './calendar';
import type { BirthInput, BaziResult, Pillar, Dayun, ShiShenType, ShiShenMap } from './types';

const SHICHEN_TO_HOUR: Record<string, number> = {
  '子': 23, '丑': 1, '寅': 3, '卯': 5, '辰': 7, '巳': 9,
  '午': 11, '未': 13, '申': 15, '酉': 17, '戌': 19, '亥': 21,
};

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function resolveHour(input: BirthInput): number {
  if (input.timeMode === 'unknown') {
    return 23;
  }
  if (input.timeMode === 'shichen') {
    return SHICHEN_TO_HOUR[input.shichen ?? '子'] ?? 23;
  }
  return input.hour ?? 12;
}

function computeDayun(birthYear: number, gender: 'male' | 'female'): Dayun[] {
  const startAge = 8;
  const dayun: Dayun[] = [];

  for (let i = 0; i < 8; i++) {
    const age = startAge + i * 10;
    const year = birthYear + age;

    dayun.push({
      age,
      year,
      stem: STEMS[i % 10],
      branch: BRANCHES[i % 12],
      stemName: STEMS[i % 10],
      branchName: BRANCHES[i % 12],
    });
  }

  return dayun;
}

function computeShiShen(dayStemIdx: number): ShiShenMap {
  const shiShenList: ShiShenType[] = ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '偏官', '正官', '偏印', '正印'];

  return {
    yearStem: shiShenList[(dayStemIdx + 2) % 10],
    monthStem: shiShenList[(dayStemIdx + 3) % 10],
    dayStem: shiShenList[dayStemIdx],
    hourStem: shiShenList[(dayStemIdx + 6) % 10],
  };
}

function createPillar(stem: string, branch: string): Pillar {
  return {
    stem,
    branch,
    stemName: stem,
    branchName: branch,
  };
}

export function computeBazi(input: BirthInput): BaziResult {
  let year = input.year;
  let month = input.month;
  let day = input.day;

  if (input.calendar === 'lunar') {
    const solar = toSolar(year, month, day);
    if (solar) {
      const parts = solar.split('-');
      year = parseInt(parts[0]);
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    }
  }

  const hour = resolveHour(input);

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`;
  const lsr = lunisolar(dateStr);
  const char8 = lsr.char8;

  const yearPillar = createPillar(char8.year.stem.toString(), char8.year.branch.toString());
  const monthPillar = createPillar(char8.month.stem.toString(), char8.month.branch.toString());
  const dayPillar = createPillar(char8.day.stem.toString(), char8.day.branch.toString());
  const hourPillar = createPillar(char8.hour.stem.toString(), char8.hour.branch.toString());

  const lunarDateStr = toLunar(year, month, day);
  const solarDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const dayun = computeDayun(year, input.gender);
  const dayStemIdx = STEMS.indexOf(char8.day.stem.toString());
  const shiShen = computeShiShen(dayStemIdx);

  return {
    solarDate: solarDateStr,
    lunarDate: lunarDateStr,
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayun,
    shiShen,
  };
}
