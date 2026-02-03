#!/usr/bin/env tsx

import { execSync } from 'child_process'

const patterns = [
  'publicTitleSq',
  'publicDescriptionSq',
  'publicLocationCitySq',
  'realDescriptionSq',
  'bioSq',
  'preferredCitySq',
]

console.log('🔍 Verifying no Albanian (*Sq) field references remain...\n')

let hasErrors = false

patterns.forEach(pattern => {
  try {
    const result = execSync(
      `grep -r "${pattern}" app components lib --include="*.ts" --include="*.tsx" 2>/dev/null || true`,
      { encoding: 'utf-8' }
    )

    if (result.trim()) {
      console.error(`❌ Found references to ${pattern}:`)
      console.error(result)
      hasErrors = true
    } else {
      console.log(`✅ No references to ${pattern}`)
    }
  } catch (error) {
    // Grep returns non-zero exit code when no matches found, which is what we want
  }
})

if (hasErrors) {
  console.error('\n❌ Verification failed! Albanian field references still exist.')
  process.exit(1)
} else {
  console.log('\n✅ All verifications passed! No Albanian field references found.')
  process.exit(0)
}
