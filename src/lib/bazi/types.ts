// Gender for 大运 direction
export type Gender = 'male' | 'female';

// Time input mode
export type TimeMode = 'precise' | 'shichen' | 'unknown';

// Calendar mode for date input
export type CalendarMode = 'solar' | 'lunar';

// Birth input — year/month/day as separate fields (BZ-01)
export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour?: number;        // 0-23, used when timeMode='precise'
  minute?: number;      // 0-30, used when timeMode='precise'
  calendar: CalendarMode;
  timeMode: TimeMode;
  shichen?: string;     // 时辰 name e.g. '子', '丑', used when timeMode='shichen'
  gender: Gender;
  name?: string;
}

// 天干地支 pillar representation
export interface Pillar {
  stem: string;    // 天干 e.g. '甲', '乙', '丙'
  branch: string;  // 地支 e.g. '子', '丑', '寅'
  stemName: string;  // 汉字 e.g. '甲', '乙'
  branchName: string; // 汉字 e.g. '子', '丑'
}

// 十神
export type ShiShenType =
  | '比肩' | '劫财' | '食神' | '伤官' | '偏财' | '正财'
  | '偏官' | '正官' | '偏印' | '正印';

// Dayun (大运) period
export interface Dayun {
  age: number;        // Starting age (e.g. 8)
  year: number;       // Starting year (e.g. 2008)
  stem: string;       // 天干
  branch: string;     // 地支
  stemName: string;
  branchName: string;
}

// 十神 map keyed by pillar position
export type ShiShenMap = {
  yearStem: ShiShenType;
  monthStem: ShiShenType;
  dayStem: ShiShenType;
  hourStem: ShiShenType;
};

// Full Bazi result from computeBazi()
export interface BaziResult {
  // Birth info
  solarDate: string;      // e.g. '2024-02-10'
  lunarDate: string;       // e.g. '正月初一'

  // 四柱
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;

  // 大运 (8 periods starting from birth)
  dayun: Dayun[];

  // 十神 (based on day master)
  shiShen: ShiShenMap;
}
