// types/odontogram.ts
import { ToothPart, ToothPosition, ToothSurface, ProcedureVisualType as ProcedureVisualTypeEnum } from './tooth'
export interface ToothData {
  number: string
  position?: number // Anatomical position 1-8 (1=center, 8=back), optional for backward compatibility
  verticalOffset?: number // Individual vertical offset in pixels, positive for down, negative for up
  svgId?: string // SVG element ID to use for rendering (for converted teeth)
  toothProcedures: ToothProcedureAssignment[]
  schemaProcedures: SchemaProcedureAssignment[]
  isEmptySlot?: boolean // If true, this is a gum-only empty slot (no label, no tooth)
}

export interface ToothProcedureAssignment {
  procedure: Procedure
  toothPart: ToothPart
  position?: ToothPosition
}

export interface SchemaProcedureAssignment {
  procedure: Procedure
  surface: ToothSurface
}

// New lightweight assignment interfaces for data storage (without visual config)
export interface ToothProcedureReference {
  procedureId: string
  procedureName: string // For quick lookup/display
  toothPart: ToothPart
  position?: ToothPosition
}

export interface SchemaProcedureReference {
  procedureId: string
  procedureName: string // For quick lookup/display
  surface: ToothSurface
}

export interface Procedure {
  name: string // Dynamic from API
  visual: ProcedureVisualType
  behavior:
    | 'None'
    | 'CrossOutTooth'
    | 'HideTooth'
    | 'RootOnly'
    | 'EmphasizeSurface'
    | 'Implant'
    | 'ImpactedTooth'
}

// New interface for API-managed procedure configuration
export interface ProcedureConfig {
  id: string
  name: string
  visual: ProcedureVisualType
  behavior:
    | 'None'
    | 'CrossOutTooth'
    | 'HideTooth'
    | 'RootOnly'
    | 'EmphasizeSurface'
    | 'Implant'
    | 'ImpactedTooth'
}

export interface ProcedureVisualType {
  visualType: ProcedureVisualTypeEnum
  /**
   * For visualType 'Color', value is a color string.
   * For visualType 'Icon', value is a lucide icon name (e.g., 'Eye', 'ArrowLeftRight').
   * For GumShape/ToothShape, value is a color or shape identifier.
   * Value is optional; if not present, no icon or color is rendered.
   */
  iconSource?: ProcedureIconSource
  value?: string
}

export enum ProcedureIconSource {
  Lucide = 'lucide',
  Tabler = 'tabler',
  Mdi = 'mdi',
}
// Type for the procedure target mapping - flexible for API data
export type ProcedureTargetMap = Record<string, string | string[]>

export enum ExtraToothDirection {
  Before = 'before',
  After = 'after',
}

export enum ToothContainerDirection {
  Top = 'top',
  Bottom = 'bottom',
}
