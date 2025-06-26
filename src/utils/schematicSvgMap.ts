// utils/schematicSvgMap.ts
// 🚨 CUSTOMIZE THESE IMPORTS FOR YOUR SCHEMATIC SVG FILES 🚨

// Import your schematic SVG files
import MolarSchematic from '@/assets/schematics/porto_molar_scheme.svg?component'
import IncisorSchematic from '@/assets/schematics/porto_incisor_scheme.svg?component'

// Example: Comment out if you don't have these files yet
// import MolarSchematic from '@/assets/schematics/molar.svg?component';
// import IncisorSchematic from '@/assets/schematics/incisor.svg?component';

// 🚨 UPDATE THIS MAP WITH YOUR AVAILABLE SCHEMATIC SVG FILES 🚨
export const SchematicSvgMap: Record<string, any> = {
  // Uncomment when you have the SVG files:
  molar: MolarSchematic,
  incisor: IncisorSchematic,
  // For now, no schematics - will show placeholders
}

// Helper function to check if a schematic has an SVG available
export const hasSchematicSvg = (type: 'molar' | 'incisor'): boolean => {
  return type in SchematicSvgMap
}

// Helper function to get schematic SVG component
export const getSchematicSvgComponent = (type: 'molar' | 'incisor') => {
  return SchematicSvgMap[type] || null
}

// Helper to get all available schematic types
export const getAvailableSchematicTypes = (): string[] => {
  return Object.keys(SchematicSvgMap)
}

/*
  🚀 USAGE INSTRUCTIONS:
  
  1. Add your schematic SVG files to: src/assets/schematics/
     - molar_scheme.svg (for molar teeth: 16,17,18,26,27,28,36,37,38,46,47,48)
     - incisor_scheme.svg (for all other teeth: incisors, canines, premolars)
  
  2. Import them at the top of this file:
     import MolarSchematic from '@/assets/schematics/molar_scheme.svg?component';
     import IncisorSchematic from '@/assets/schematics/incisor_scheme.svg?component';
  
  3. Add them to the SchematicSvgMap object:
     'molar': MolarSchematic,
     'incisor': IncisorSchematic,
  
  4. The components will automatically use available SVGs and show placeholders for missing ones.
  
  📁 RECOMMENDED FILE NAMING:
  src/assets/schematics/
  ├── molar_scheme.svg     (surface diagram for molars)
  └── incisor_scheme.svg   (surface diagram for incisors/canines/premolars)
  
  🎯 SCHEMATIC SVG STRUCTURE:
  Your schematic SVG files should have these IDs for surface interactions:
  - id="mesial"   (mesial surface)
  - id="distal"   (distal surface) 
  - id="buccal"   (buccal/labial surface)
  - id="lingual"  (lingual/palatal surface)
  
  Example SVG structure:
  <svg viewBox="0 0 80 80">
    <path id="mesial" d="..." fill="transparent" stroke="black"/>
    <path id="distal" d="..." fill="transparent" stroke="black"/>
    <path id="buccal" d="..." fill="transparent" stroke="black"/>
    <path id="lingual" d="..." fill="transparent" stroke="black"/>
  </svg>
  
  🔧 TOOTH TYPE CLASSIFICATION:
  - Molars: 16,17,18,26,27,28,36,37,38,46,47,48 → use molar_scheme.svg
  - All others: incisors, canines, premolars → use incisor_scheme.svg
  */
