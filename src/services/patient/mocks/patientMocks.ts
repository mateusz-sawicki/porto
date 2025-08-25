import type { Patient } from '@/types/patient/patient'

// Generate GUID
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Mock data generator
export function createMockPatients(): Patient[] {
  const names = [
    'John',
    'Jane',
    'Michael',
    'Sarah',
    'David',
    'Emily',
    'Robert',
    'Lisa',
    'James',
    'Maria',
    'Christopher',
    'Patricia',
    'Daniel',
    'Jennifer',
    'Matthew',
    'Elizabeth',
    'Anthony',
    'Linda',
    'Mark',
    'Barbara',
    'Steven',
    'Susan',
    'Paul',
    'Jessica',
    'Andrew',
    'Nancy',
    'Joshua',
    'Dorothy',
    'Kenneth',
    'Helen',
  ]

  const surnames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzales',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
    'Lee',
    'Perez',
    'Thompson',
    'White',
    'Harris',
    'Sanchez',
    'Clark',
    'Ramirez',
    'Lewis',
    'Robinson',
  ]

  return Array.from({ length: 50 }, (_, index) => {
    const creationDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date within last year
    const updateDate = new Date(
      creationDate.getTime() + Math.random() * (Date.now() - creationDate.getTime()),
    )

    return {
      id: generateId(),
      firstName: names[Math.floor(Math.random() * names.length)],
      lastName: surnames[Math.floor(Math.random() * surnames.length)],
      isActive: Math.random() > 0.15, // 85% active patients
      createdAt: creationDate,
      updatedAt: updateDate,
    }
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Sort by creation date (newest first)
}

// Individual mock patient
export function createMockPatient(overrides: Partial<Patient> = {}): Patient {
  const names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily']
  const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia']

  const now = new Date()

  return {
    id: generateId(),
    firstName: names[Math.floor(Math.random() * names.length)],
    lastName: surnames[Math.floor(Math.random() * surnames.length)],
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
