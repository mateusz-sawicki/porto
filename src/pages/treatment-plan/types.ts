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
  currentStepDetail: StepDetails | null
}

export interface MedicalInterviewStepRef {
  getFormData: () => StepData
  handleNextStep: () => void
}
