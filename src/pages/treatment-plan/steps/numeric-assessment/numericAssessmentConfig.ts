export const fieldConfigs = {
  painLevel: {
    type: 'text',
    label: 'Poziom bólu (1 - brak bólu, 10 - silny ból)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
    inputType: 'number',
  },
  comfortLevel: {
    type: 'text',
    label: 'Poziom komfortu (1 - bardzo niekomfortowo, 10 - bardzo komfortowo)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
  },
  functionalityLevel: {
    type: 'text',
    label: 'Funkcjonalność (1 - bardzo ograniczona, 10 - pełna funkcjonalność)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
  },
  aestheticsLevel: {
    type: 'text',
    label: 'Estetyka (1 - bardzo niezadowalająca, 10 - doskonała)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
  },
  occlusionLevel: {
    type: 'text',
    label: 'Okluzja (1 - bardzo nieprawidłowa, 10 - prawidłowa)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
  },
  hygieneAbility: {
    type: 'text',
    label: 'Możliwość utrzymania higieny (1 - bardzo trudna, 10 - bardzo łatwa)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
  },
  mobilityLevel: {
    type: 'text',
    label: 'Ruchomość szczęki (1 - bardzo ograniczona, 10 - pełna)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
  },
  stabilityLevel: {
    type: 'text',
    label: 'Stabilność uzębienia (1 - bardzo niestabilne, 10 - bardzo stabilne)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
  },
  symmetryLevel: {
    type: 'text',
    label: 'Symetria twarzy (1 - bardzo asymetryczna, 10 - symetryczna)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
  },
  overallSatisfaction: {
    type: 'text',
    label: 'Ogólne zadowolenie pacjenta (1 - bardzo niezadowolony, 10 - bardzo zadowolony)',
    placeholder: 'Wprowadź wartość od 1 do 10',
    rules: ['min:1', 'max:10', 'numeric'],
  },
}
