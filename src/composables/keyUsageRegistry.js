import { reactive } from 'vue'

export const generatedKeyUsageRegistry = reactive({})

export function registerGeneratedKeyUsage (row) {
  if (!row?.index) return
  generatedKeyUsageRegistry[row.index] = {
    index: Number(row.index),
    algorithm: row.keyAlgorithm,
    keyUsage: row.keyUsage || ''
  }
}