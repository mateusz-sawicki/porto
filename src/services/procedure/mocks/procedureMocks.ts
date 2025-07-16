import type { ProcedureWithTarget } from '../procedureApi'
import { ProcedureIconSource } from '@/types/odontogram/odontogram'

export function createMockProcedures(): ProcedureWithTarget[] {
  return [
    // Restorative Procedures
    {
      name: 'Wypełnienie',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#3b82f6' },
      targets: ['Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Restorative',
      description: 'Dental filling procedure for cavities and tooth restoration',
      isActive: true,
    },
    {
      name: 'Korona',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#eab308' },
      targets: 'Crown',
      category: 'Restorative',
      description: 'Dental crown placement for tooth protection and restoration',
      isActive: true,
    },
    {
      name: 'Próchnica',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#ec4899' },
      targets: ['Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Caries detection and marking',
      isActive: true,
    },

    // Endodontic Procedures
    {
      name: 'Leczenie kanałowe',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#ef4444' },
      targets: 'Root',
      category: 'Endodontic',
      description: 'Root canal treatment procedure',
      isActive: true,
    },

    // Surgical Procedures
    {
      name: 'Ekstrakcja',
      behavior: 'CrossOutTooth',
      visual: { visualType: 'Icon', value: 'X' },
      targets: 'Tooth',
      category: 'Surgical',
      description: 'Tooth extraction procedure',
      isActive: true,
    },
    {
      name: 'Ząb zatrzymany',
      behavior: 'ImpactedTooth',
      visual: { visualType: 'ToothShape', value: '↓' },
      targets: 'Tooth',
      category: 'Surgical',
      description: 'Impacted tooth marking',
      isActive: true,
    },
    {
      name: 'Implant',
      behavior: 'Implant',
      visual: { visualType: 'ToothShape', value: '#9a9a9a' },
      targets: 'Tooth',
      category: 'Surgical',
      description: 'Dental implant placement',
      isActive: true,
    },

    // Periodontal Procedures
    {
      name: 'Recesja',
      behavior: 'None',
      visual: { visualType: 'GumShape', value: '#000000' },
      targets: 'Tooth',
      category: 'Periodontal',
      description: 'Gingival recession marking',
      isActive: true,
    },

    // Missing Teeth
    {
      name: 'Brak zęba',
      behavior: 'HideTooth',
      visual: { visualType: 'Icon', value: 'Ø' },
      targets: 'Tooth',
      category: 'Missing',
      description: 'Missing tooth marking',
      isActive: true,
    },
    {
      name: 'tylko korzeń',
      behavior: 'RootOnly',
      visual: { visualType: 'ToothShape', value: 'R' },
      targets: 'Tooth',
      category: 'Missing',
      description: 'Root only remaining',
      isActive: true,
    },

    // Diagnostic Procedures
    {
      name: 'Obserwacja',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'Eye', iconSource: ProcedureIconSource.Lucide },
      targets: ['Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Observation and monitoring marking',
      isActive: true,
    },
    {
      name: 'Ruchomość',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Tooth mobility assessment',
      isActive: true,
    },

    // X-Ray Procedures
    {
      name: 'XD',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Radiographic',
      description: 'X-ray examination needed',
      isActive: true,
    },
    {
      name: 'XD1',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Radiographic',
      description: 'X-ray examination - Level 1',
      isActive: true,
    },
    {
      name: 'XD2',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Radiographic',
      description: 'X-ray examination - Level 2',
      isActive: true,
    },
    {
      name: 'XD3',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Radiographic',
      description: 'X-ray examination - Level 3',
      isActive: true,
    },
    {
      name: 'XD4',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Radiographic',
      description: 'X-ray examination - Level 4',
      isActive: true,
    },

    // Wear and Damage
    {
      name: 'Starcie',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'IconTilde', iconSource: ProcedureIconSource.Tabler },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Wear',
      description: 'Tooth wear and abrasion marking',
      isActive: true,
    },
    {
      name: 'Ubytek klinowy',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'TriangleRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth'],
      category: 'Wear',
      description: 'Wedge-shaped defect marking',
      isActive: true,
    },

    // Inactive/Deprecated Procedures (for demonstration)
    {
      name: 'Stary zabieg',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#6b7280' },
      targets: 'Tooth',
      category: 'Deprecated',
      description: 'Deprecated procedure - no longer used',
      isActive: false,
    },
  ]
}
