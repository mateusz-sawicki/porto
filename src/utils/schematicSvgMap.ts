import MolarSchematic from '@/assets/schematics/porto_molar_scheme.svg?component'
import IncisorSchematic from '@/assets/schematics/porto_incisor_scheme.svg?component'

export const SchematicSvgMap: Record<string, any> = {
  molar: MolarSchematic,
  incisor: IncisorSchematic,
}

export const hasSchematicSvg = (type: 'molar' | 'incisor'): boolean => {
  return type in SchematicSvgMap
}

export const getSchematicSvgComponent = (type: 'molar' | 'incisor') => {
  return SchematicSvgMap[type] || null
}

export const getAvailableSchematicTypes = (): string[] => {
  return Object.keys(SchematicSvgMap)
}
