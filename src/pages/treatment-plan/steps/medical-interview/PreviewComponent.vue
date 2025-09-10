<!-- PreviewComponent.vue -->
<template>
  <div class="preview-container">
    <h3>Sprawdź swoje dane przed rejestracją</h3>

    <div class="preview-section">
      <h4>📋 Dane osobowe</h4>
      <div class="data-row">
        <span class="label">Imię i nazwisko:</span>
        <span class="value">{{ formData.firstName }} {{ formData.lastName }}</span>
      </div>
      <div class="data-row">
        <span class="label">Data urodzenia:</span>
        <span class="value">{{ formatDate(formData.birthDate) }}</span>
      </div>
      <div class="data-row">
        <span class="label">Płeć:</span>
        <span class="value">{{ getGenderLabel(formData.gender) }}</span>
      </div>
    </div>

    <div class="preview-section">
      <h4>👤 Konto</h4>
      <div class="data-row">
        <span class="label">Email:</span>
        <span class="value">{{ formData.email }}</span>
      </div>
      <div class="data-row">
        <span class="label">Nazwa użytkownika:</span>
        <span class="value">@{{ formData.username }}</span>
      </div>
      <div class="data-row">
        <span class="label">Hasło:</span>
        <span class="value">••••••••</span>
      </div>
    </div>

    <div class="preview-section">
      <h4>⚙️ Preferencje</h4>
      <div class="data-row">
        <span class="label">Zainteresowania:</span>
        <span class="value">
          <div class="interests-tags" v-if="formData.interests && formData.interests.length > 0">
            <span v-for="interest in formData.interests" :key="interest" class="interest-tag">
              {{ getInterestLabel(interest) }}
            </span>
          </div>
          <span v-else class="no-data">Nie wybrano</span>
        </span>
      </div>
      <div class="data-row">
        <span class="label">Newsletter:</span>
        <span class="value">
          <span :class="formData.newsletter ? 'status-yes' : 'status-no'">
            {{ formData.newsletter ? 'Tak' : 'Nie' }}
          </span>
        </span>
      </div>
      <div class="data-row" v-if="formData.newsletter && formData.notifications">
        <span class="label">Powiadomienia:</span>
        <span class="value">
          <div class="notification-types">
            <span v-if="formData.notifications.email" class="notification-type">📧 Email</span>
            <span v-if="formData.notifications.sms" class="notification-type">📱 SMS</span>
            <span v-if="formData.notifications.push" class="notification-type">🔔 Push</span>
          </div>
        </span>
      </div>
      <div class="data-row">
        <span class="label">Język:</span>
        <span class="value">{{ getLanguageLabel(formData.language) }}</span>
      </div>
    </div>

    <div class="summary-stats">
      <div class="stat-card">
        <div class="stat-number">{{ completionPercentage }}%</div>
        <div class="stat-label">Wypełnienie</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ interestCount }}</div>
        <div class="stat-label">Zainteresowań</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ formData.language?.toUpperCase() || 'PL' }}</div>
        <div class="stat-label">Język</div>
      </div>
    </div>

    <div class="preview-actions">
      <p class="info-text">
        ℹ️ Sprawdź wszystkie dane. Po rejestracji będziesz mógł je edytować w ustawieniach konta.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({}),
  },
})

// Computed properties
const completionPercentage = computed(() => {
  const requiredFields = ['firstName', 'lastName', 'email', 'password', 'username']
  const completedFields = requiredFields.filter((field) => props.formData[field]).length
  return Math.round((completedFields / requiredFields.length) * 100)
})

const interestCount = computed(() => {
  return props.formData.interests?.length || 0
})

// Helper functions
function formatDate(dateString) {
  if (!dateString) return 'Nie podano'
  return new Date(dateString).toLocaleDateString('pl-PL')
}

function getGenderLabel(gender) {
  const labels = {
    male: 'Mężczyzna',
    female: 'Kobieta',
    other: 'Inna',
  }
  return labels[gender] || 'Nie podano'
}

function getInterestLabel(interest) {
  const labels = {
    technology: 'Technologia',
    sports: 'Sport',
    music: 'Muzyka',
    travel: 'Podróże',
    cooking: 'Gotowanie',
    reading: 'Czytanie',
  }
  return labels[interest] || interest
}

function getLanguageLabel(language) {
  const labels = {
    pl: 'Polski',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
  }
  return labels[language] || 'Polski'
}
</script>

<style scoped>
.preview-container {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin: 16px 0;
}

.preview-container h3 {
  color: #1e293b;
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 18px;
}

.preview-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.preview-section h4 {
  color: #374151;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.data-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #64748b;
  min-width: 140px;
}

.value {
  color: #1e293b;
  font-weight: 500;
  text-align: right;
  flex: 1;
}

.no-data {
  color: #94a3b8;
  font-style: italic;
}

.status-yes {
  color: #059669;
  font-weight: 600;
}

.status-no {
  color: #dc2626;
  font-weight: 600;
}

.interests-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.interest-tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.notification-types {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.notification-type {
  font-size: 14px;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin: 24px 0;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-actions {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 20px;
}

.info-text {
  margin: 0;
  color: #92400e;
  font-size: 14px;
}

@media (max-width: 640px) {
  .data-row {
    flex-direction: column;
    gap: 4px;
  }

  .value {
    text-align: left;
  }

  .interests-tags {
    justify-content: flex-start;
  }

  .notification-types {
    align-items: flex-start;
  }
}
</style>
