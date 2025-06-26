// utils/toothSvgMap.ts
// 🚨 CUSTOMIZE THESE IMPORTS FOR YOUR SVG FILES 🚨

// Quadrant 1 (Upper Right) - Import your SVG files
import Tooth11 from '@/assets/teeth/porto_tooth_11.svg?component'
import Tooth12 from '@/assets/teeth/porto_tooth_12.svg?component'
import Tooth13 from '@/assets/teeth/porto_tooth_13.svg?component'
import Tooth14 from '@/assets/teeth/porto_tooth_14.svg?component'
import Tooth15 from '@/assets/teeth/porto_tooth_15.svg?component'
import Tooth16 from '@/assets/teeth/porto_tooth_16.svg?component'
import Tooth17 from '@/assets/teeth/porto_tooth_17.svg?component'
import Tooth18 from '@/assets/teeth/porto_tooth_18.svg?component'

// Quadrant 2 (Upper Left)
import Tooth21 from '@/assets/teeth/porto_tooth_21.svg?component'
import Tooth22 from '@/assets/teeth/porto_tooth_22.svg?component'
import Tooth23 from '@/assets/teeth/porto_tooth_23.svg?component'
import Tooth24 from '@/assets/teeth/porto_tooth_24.svg?component'
import Tooth25 from '@/assets/teeth/porto_tooth_25.svg?component'
import Tooth26 from '@/assets/teeth/porto_tooth_26.svg?component'
import Tooth27 from '@/assets/teeth/porto_tooth_27.svg?component'
import Tooth28 from '@/assets/teeth/porto_tooth_28.svg?component'

// Quadrant 3 (Lower Left)
import Tooth31 from '@/assets/teeth/porto_tooth_31.svg?component'
import Tooth32 from '@/assets/teeth/porto_tooth_32.svg?component'
import Tooth33 from '@/assets/teeth/porto_tooth_33.svg?component'
import Tooth34 from '@/assets/teeth/porto_tooth_34.svg?component'
import Tooth35 from '@/assets/teeth/porto_tooth_35.svg?component'
import Tooth36 from '@/assets/teeth/porto_tooth_36.svg?component'
import Tooth37 from '@/assets/teeth/porto_tooth_37.svg?component'
import Tooth38 from '@/assets/teeth/porto_tooth_38.svg?component'

// Quadrant 4 (Lower Right)
import Tooth41 from '@/assets/teeth/porto_tooth_41.svg?component'
import Tooth42 from '@/assets/teeth/porto_tooth_42.svg?component'
import Tooth43 from '@/assets/teeth/porto_tooth_43.svg?component'
import Tooth44 from '@/assets/teeth/porto_tooth_44.svg?component'
import Tooth45 from '@/assets/teeth/porto_tooth_45.svg?component'
import Tooth46 from '@/assets/teeth/porto_tooth_46.svg?component'
import Tooth47 from '@/assets/teeth/porto_tooth_47.svg?component'
import Tooth48 from '@/assets/teeth/porto_tooth_48.svg?component'

// 🚨 UPDATE THIS MAP WITH YOUR AVAILABLE SVG FILES 🚨
export const ToothSvgMap: Record<string, any> = {
  // Uncomment and add entries as you import SVGs above:

  // Quadrant 1 (Upper Right)
  '11': Tooth11,
  '12': Tooth12,
  '13': Tooth13,
  '14': Tooth14,
  '15': Tooth15,
  '16': Tooth16,
  '17': Tooth17,
  '18': Tooth18,

  // Quadrant 2 (Upper Left)
  '21': Tooth21,
  '22': Tooth22,
  '23': Tooth23,
  '24': Tooth24,
  '25': Tooth25,
  '26': Tooth26,
  '27': Tooth27,
  '28': Tooth28,

  // Quadrant 3 (Lower Left)
  '31': Tooth31,
  '32': Tooth32,
  '33': Tooth33,
  '34': Tooth34,
  '35': Tooth35,
  '36': Tooth36,
  '37': Tooth37,
  '38': Tooth38,

  // Quadrant 4 (Lower Right)
  '41': Tooth41,
  '42': Tooth42,
  '43': Tooth43,
  '44': Tooth44,
  '45': Tooth45,
  '46': Tooth46,
  '47': Tooth47,
  '48': Tooth48,
}

// Helper function to check if a tooth has an SVG available
export const hasToothSvg = (toothNumber: string): boolean => {
  const baseNumber = toothNumber.replace(/[+-]\d+$/, '')
  return baseNumber in ToothSvgMap
}

// Helper function to get tooth SVG component
export const getToothSvgComponent = (toothNumber: string) => {
  const baseNumber = toothNumber.replace(/[+-]\d+$/, '')
  return ToothSvgMap[baseNumber] || null
}

// Helper to get all available tooth numbers
export const getAvailableToothNumbers = (): string[] => {
  return Object.keys(ToothSvgMap)
}
