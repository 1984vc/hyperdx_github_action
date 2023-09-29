import {it} from '@jest/globals'

export function isE2E() {
  return process.env.E2E === '1'
}

export function skipUnlessE2E() {
  if (!isE2E()) {
    it.only('does not work on unless E2E is set', () => {})
  }
}
