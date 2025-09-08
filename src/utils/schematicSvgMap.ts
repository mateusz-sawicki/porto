import MolarSchematic from '@/assets/schematics/porto_molar_scheme.svg?component'
import IncisorSchematic from '@/assets/schematics/porto_incisor_scheme.svg?component'
import { ToothType } from '@/types/odontogram/tooth'

export const SchematicSvgMap: Record<string, any> = {
  [ToothType.Molar]: MolarSchematic,
  [ToothType.Incisor]: IncisorSchematic,
}

export const hasSchematicSvg = (type: ToothType): boolean => {
  return type in SchematicSvgMap
}

export const getSchematicSvgComponent = (type: ToothType) => {
  return SchematicSvgMap[type] || null
}

export const getAvailableSchematicTypes = (): string[] => {
  return Object.keys(SchematicSvgMap)
}
