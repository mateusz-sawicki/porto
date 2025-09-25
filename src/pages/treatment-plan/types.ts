export interface Step {
  step: number
  title: string
  description: string
}

export interface StepData {
  [key: string]: any
}

export interface StepDetails {
  detailsStep: number
  detailsData: StepData
}

export interface StepsDetails {
  stepsDetails: StepDetails[]
}

export interface MedicalInterviewStepRef {
  getFormData: () => StepData
  handleNextStep: () => void
}
