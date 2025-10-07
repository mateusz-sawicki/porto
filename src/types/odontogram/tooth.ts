export enum ToothPart {
  Tooth = 'Tooth',
  Crown = 'Crown',
  Root = 'Root'
}

export enum ToothPosition {
  Top = 'Top',
  Middle = 'Middle',
  Bottom = 'Bottom'
}

export enum ToothSurface {
  Mesial = 'Mesial',
  Distal = 'Distal',
  Buccal = 'Buccal',
  Lingual = 'Lingual'
}

// Target types - matching the API enum format
export type TargetToothSurface =
  | 'MesialSurface'
  | 'DistalSurface'
  | 'BuccalSurface'
  | 'LingualSurface'
  | 'IncisalSurface'
  | 'OcclusalSurface'
  | 'LabialSurface'
  | 'PalatalSurface'
  | 'Tooth'
  | 'Crown'
  | 'Root'

export enum ToothType {
  Molar = 'molar',
  Incisor = 'incisor'
}

export enum ProcedureVisualType {
  Color = 'Color',
  Icon = 'Icon',
  GumShape = 'GumShape',
  ToothShape = 'ToothShape',
  Pattern = 'Pattern'
}

export enum IconPosition {
  Tooth = 'tooth',
  Crown = 'crown',
  Root = 'root',
  Schematic = 'schematic'
}