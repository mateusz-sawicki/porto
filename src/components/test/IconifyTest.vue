<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-bold">Iconify Dynamic Icons Test</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Direct IconifyIcon tests -->
      <div class="border p-4 rounded">
        <h3 class="font-semibold mb-2">Direct IconifyIcon</h3>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <IconifyIcon
              icon-name="lucide:triangle-right"
              icon-source="lucide"
              class="w-6 h-6"
            />
            <span>lucide:triangle-right (API format)</span>
          </div>
          <div class="flex items-center gap-2">
            <IconifyIcon
              icon-name="mdi:tilde"
              icon-source="mdi"
              class="w-6 h-6"
            />
            <span>mdi:tilde (API format)</span>
          </div>
          <div class="flex items-center gap-2">
            <IconifyIcon
              icon-name="home"
              icon-source="lucide"
              class="w-6 h-6"
            />
            <span>home (direct)</span>
          </div>
        </div>
      </div>

      <!-- Via ProcedureIcon -->
      <div class="border p-4 rounded">
        <h3 class="font-semibold mb-2">Via ProcedureIcon (API Simulation)</h3>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <ProcedureIcon
              icon-name="lucide:triangle-right"
              :icon-source="ProcedureIconSource.Lucide"
              class="w-6 h-6"
            />
            <span>API: lucide + lucide:triangle-right</span>
          </div>
          <div class="flex items-center gap-2">
            <ProcedureIcon
              icon-name="mdi:heart"
              :icon-source="ProcedureIconSource.Mdi"
              class="w-6 h-6"
            />
            <span>API: mdi + mdi:heart</span>
          </div>
          <div class="flex items-center gap-2">
            <ProcedureIcon
              icon-name="check-circle"
              :icon-source="ProcedureIconSource.Tabler"
              class="w-6 h-6"
            />
            <span>API: tabler + check-circle</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 p-3 bg-blue-50 rounded">
      <p class="text-sm text-blue-700">
        <strong>💡 How it works:</strong> API can send any icon in format:
        <code>iconSource: "lucide"</code> + <code>iconName: "lucide:triangle-right"</code>
        or <code>iconSource: "mdi"</code> + <code>iconName: "any-mdi-icon"</code>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconifyIcon from '@/components/odontogram/IconifyIcon.vue'
import ProcedureIcon from '@/components/odontogram/ProcedureIcon.vue'
import { ProcedureIconSource } from '@/types/odontogram/odontogram'
</script>