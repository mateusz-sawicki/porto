// Tooth conversion utilities for permanent ↔ primary teeth
export interface ToothConversionMap {
  permanent: string
  primary: string
}

// Mapping between permanent and primary teeth
const TOOTH_CONVERSION_MAP: ToothConversionMap[] = [
  // Upper Right Quadrant (1x → 5x)
  { permanent: '11', primary: '51' }, // Central incisor
  { permanent: '12', primary: '52' }, // Lateral incisor
  { permanent: '13', primary: '53' }, // Canine
  { permanent: '14', primary: '54' }, // First premolar → First molar
  { permanent: '15', primary: '55' }, // Second premolar → Second molar
  
  // Upper Left Quadrant (2x → 6x)
  { permanent: '21', primary: '61' }, // Central incisor
  { permanent: '22', primary: '62' }, // Lateral incisor
  { permanent: '23', primary: '63' }, // Canine
  { permanent: '24', primary: '64' }, // First premolar → First molar
  { permanent: '25', primary: '65' }, // Second premolar → Second molar
  
  // Lower Left Quadrant (3x → 7x)
  { permanent: '31', primary: '71' }, // Central incisor
  { permanent: '32', primary: '72' }, // Lateral incisor
  { permanent: '33', primary: '73' }, // Canine
  { permanent: '34', primary: '74' }, // First premolar → First molar
  { permanent: '35', primary: '75' }, // Second premolar → Second molar
  
  // Lower Right Quadrant (4x → 8x)
  { permanent: '41', primary: '81' }, // Central incisor
  { permanent: '42', primary: '82' }, // Lateral incisor
  { permanent: '43', primary: '83' }, // Canine
  { permanent: '44', primary: '84' }, // First premolar → First molar
  { permanent: '45', primary: '85' }, // Second premolar → Second molar
]

/**
 * Converts a permanent tooth number to its corresponding primary tooth number
 */
export function permanentToPrimary(toothNumber: string): string | null {
  const mapping = TOOTH_CONVERSION_MAP.find(m => m.permanent === toothNumber)
  return mapping ? mapping.primary : null
}

/**
 * Converts a primary tooth number to its corresponding permanent tooth number
 */
export function primaryToPermanent(toothNumber: string): string | null {
  const mapping = TOOTH_CONVERSION_MAP.find(m => m.primary === toothNumber)
  return mapping ? mapping.permanent : null
}

/**
 * Checks if a tooth number is a primary tooth (starts with 5, 6, 7, or 8)
 */
export function isPrimaryTooth(toothNumber: string): boolean {
  const firstDigit = toothNumber[0]
  return ['5', '6', '7', '8'].includes(firstDigit)
}

/**
 * Checks if a tooth number is a permanent tooth (starts with 1, 2, 3, or 4)
 */
export function isPermanentTooth(toothNumber: string): boolean {
  const firstDigit = toothNumber[0]
  return ['1', '2', '3', '4'].includes(firstDigit)
}

/**
 * Converts tooth number between permanent and primary
 * Returns null if no conversion is available
 */
export function convertToothType(toothNumber: string): string | null {
  if (isPrimaryTooth(toothNumber)) {
    return primaryToPermanent(toothNumber)
  } else if (isPermanentTooth(toothNumber)) {
    return permanentToPrimary(toothNumber)
  }
  return null
}

/**
 * Gets all available conversions for a list of tooth numbers
 */
export function getAvailableConversions(toothNumbers: string[]): {
  toPrimary: string[]
  toPermanent: string[]
} {
  const toPrimary: string[] = []
  const toPermanent: string[] = []
  
  toothNumbers.forEach(toothNumber => {
    if (isPermanentTooth(toothNumber)) {
      const converted = permanentToPrimary(toothNumber)
      if (converted) toPrimary.push(toothNumber)
    } else if (isPrimaryTooth(toothNumber)) {
      const converted = primaryToPermanent(toothNumber)
      if (converted) toPermanent.push(toothNumber)
    }
  })
  
  return { toPrimary, toPermanent }
}