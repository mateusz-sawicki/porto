<template>
  <div class="space-y-6">
    <div class="text-center mb-6">
      <h3 class="text-2xl font-bold mb-2">Document Upload</h3>
      <p class="text-muted-foreground">Upload relevant medical documents and images</p>
    </div>

    <div class="space-y-4">
      <!-- Medical Reports Section -->
      <div class="border rounded-lg">
        <button
          @click="toggleAccordion('medicalReports')"
          class="w-full flex items-center justify-between p-4 text-left font-semibold hover:bg-gray-50"
        >
          <span class="text-lg">Medical Reports & Documents</span>
          <ChevronRight
            :class="[
              'w-5 h-5 transition-transform',
              accordionOpen.medicalReports ? 'rotate-90' : '',
            ]"
          />
        </button>
        <div v-if="accordionOpen.medicalReports" class="p-4 border-t">
          <div class="space-y-4">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload class="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p class="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                @change="
                  (e: Event) =>
                    handleFileUpload('medicalReports', (e.target as HTMLInputElement).files)
                "
                class="hidden"
                id="upload-medicalReports"
              />
              <label for="upload-medicalReports">
                <Button variant="outline" class="cursor-pointer"> Choose Files </Button>
              </label>
            </div>

            <div v-if="uploadedFiles.medicalReports.length > 0" class="space-y-2">
              <Label class="text-sm font-medium">Uploaded Files:</Label>
              <div
                v-for="(file, index) in uploadedFiles.medicalReports"
                :key="index"
                class="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span class="text-sm truncate">{{ file.name }}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="removeFile('medicalReports', index)"
                >
                  <X class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Treatment Images Section -->
      <div class="border rounded-lg">
        <button
          @click="toggleAccordion('treatmentImages')"
          class="w-full flex items-center justify-between p-4 text-left font-semibold hover:bg-gray-50"
        >
          <span class="text-lg">Treatment Images & Scans</span>
          <ChevronRight
            :class="[
              'w-5 h-5 transition-transform',
              accordionOpen.treatmentImages ? 'rotate-90' : '',
            ]"
          />
        </button>
        <div v-if="accordionOpen.treatmentImages" class="p-4 border-t">
          <div class="space-y-4">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload class="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p class="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                @change="
                  (e: Event) =>
                    handleFileUpload(
                      'treatmentImages',
                      (e.target as HTMLInputElement).files,
                    )
                "
                class="hidden"
                id="upload-treatmentImages"
              />
              <label for="upload-treatmentImages">
                <Button variant="outline" class="cursor-pointer"> Choose Files </Button>
              </label>
            </div>

            <div v-if="uploadedFiles.treatmentImages.length > 0" class="space-y-2">
              <Label class="text-sm font-medium">Uploaded Files:</Label>
              <div
                v-for="(file, index) in uploadedFiles.treatmentImages"
                :key="index"
                class="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span class="text-sm truncate">{{ file.name }}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="removeFile('treatmentImages', index)"
                >
                  <X class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight, Upload, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface UploadedFiles {
  medicalReports: File[]
  treatmentImages: File[]
}

interface Props {
  uploadedFiles: UploadedFiles
}

interface Emits {
  (e: 'update:uploadedFiles', files: UploadedFiles): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const accordionOpen = ref<Record<string, boolean>>({
  medicalReports: false,
  treatmentImages: false,
})

const toggleAccordion = (section: string) => {
  accordionOpen.value[section] = !accordionOpen.value[section]
}

const handleFileUpload = (category: string, files: FileList | null) => {
  if (files) {
    const fileArray = Array.from(files)
    const updatedFiles = { ...props.uploadedFiles }
    updatedFiles[category as keyof UploadedFiles].push(...fileArray)
    emit('update:uploadedFiles', updatedFiles)
  }
}

const removeFile = (category: string, index: number) => {
  const updatedFiles = { ...props.uploadedFiles }
  updatedFiles[category as keyof UploadedFiles].splice(index, 1)
  emit('update:uploadedFiles', updatedFiles)
}
</script> 