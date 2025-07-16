// types/odontogram.ts
export interface ToothData {
  number: string
  toothProcedures: ToothProcedureAssignment[]
  schemaProcedures: SchemaProcedureAssignment[]
}

export interface ToothProcedureAssignment {
  procedure: Procedure
  toothPart: 'Tooth' | 'Crown' | 'Root'
  position?: 'Top' | 'Middle' | 'Bottom'
}

export interface SchemaProcedureAssignment {
  procedure: Procedure
  surface: 'Mesial' | 'Distal' | 'Buccal' | 'Lingual'
}

export interface Procedure {
  name: string // Dynamic from API
  visual: ProcedureVisual
  behavior:
    | 'None'
    | 'CrossOutTooth'
    | 'HideTooth'
    | 'RootOnly'
    | 'EmphasizeSurface'
    | 'Implant'
    | 'ImpactedTooth'
}

export interface ProcedureVisual {
  visualType: 'Color' | 'Icon' | 'GumShape' | 'ToothShape' | 'TablerIcon'
  /**
   * For visualType 'Color', value is a color string.
   * For visualType 'Icon', value is a lucide icon name (e.g., 'Eye', 'ArrowLeftRight').
   * For GumShape/ToothShape, value is a color or shape identifier.
   */
  value: string
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
