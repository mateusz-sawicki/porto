import { ProcedureIconSource } from '@/types/odontogram/odontogram'

/**
 * Get the display name for an icon source
 */
export function getIconSourceName(iconSource: ProcedureIconSource): string {
  const iconSourceNames: Record<ProcedureIconSource, string> = {
    [ProcedureIconSource.Lucide]: 'Lucide',
    [ProcedureIconSource.Tabler]: 'Tabler',
  }
  
  return iconSourceNames[iconSource] || 'Unknown'
}

/**
 * Get the icon source enum value from a string
 */
export function getIconSourceFromString(source: string): ProcedureIconSource | null {
  const sourceMap: Record<string, ProcedureIconSource> = {
    'lucide': ProcedureIconSource.Lucide,
    'tabler': ProcedureIconSource.Tabler,
  }
  
  return sourceMap[source.toLowerCase()] || null
}

/**
 * Check if an icon source is supported
 */
export function isIconSourceSupported(iconSource: ProcedureIconSource): boolean {
  return Object.values(ProcedureIconSource).includes(iconSource)
}

/**
 * Get all available icon sources
 */
export function getAvailableIconSources(): Array<{ value: ProcedureIconSource; label: string }> {
  return [
    { value: ProcedureIconSource.Lucide, label: 'Lucide' },
    { value: ProcedureIconSource.Tabler, label: 'Tabler' },
  ]
} 