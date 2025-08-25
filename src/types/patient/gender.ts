export enum Gender {
  Male = 1,
  Female = 2,
}

export const GENDER_OPTIONS = [
  { value: Gender.Male, label: 'Male' },
  { value: Gender.Female, label: 'Female' },
] as const
