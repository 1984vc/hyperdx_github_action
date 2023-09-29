import dotenv from 'dotenv'
import {readFile} from 'fs/promises'
import {join} from 'path'

import {it} from '@jest/globals'

import {traceRun} from '../traceRun'
import {skipUnlessE2E} from './helpers/skipUnlessE2E'
import {GithubActionRun} from '../action'
import {DEFAULT_ENDPOINT} from '../getConfig'

dotenv.config()

skipUnlessE2E()

// Make the fixture timestamps relative to the current time
function fixTimestamps(runToFix: GithubActionRun): GithubActionRun {
  // Clone run so we don't mutate the original
  const run = JSON.parse(JSON.stringify(runToFix)) as GithubActionRun
  const currentTime = new Date().getTime()
  for (const job of run.jobs) {
    const jobEnded = job.completed_at
      ? new Date(Date.parse(job.completed_at)).getTime()
      : currentTime
    const offset = currentTime - jobEnded
    job.started_at = new Date(Date.parse(job.started_at) + offset).toISOString()
    if (job.completed_at)
      job.completed_at = new Date(
        Date.parse(job.completed_at) + offset
      ).toISOString()
    if (job.steps) {
      for (const step of job.steps) {
        if (step.started_at)
          step.started_at = new Date(
            Date.parse(step.started_at) + offset
          ).toISOString()
        if (step.completed_at)
          step.completed_at = new Date(
            Date.parse(step.completed_at) + offset
          ).toISOString()
      }
    }
  }
  return run
}

// Lets us send a real trace to the Hypertrace backend
it('Send job data to OTLP as a trace', async () => {
  const runJson = fixTimestamps(
    JSON.parse(
      await readFile(join(__dirname, 'fixtures', 'jobsList.json'), 'utf-8')
    ) as GithubActionRun
  )
  await traceRun(runJson.jobs, {
    endpoint: DEFAULT_ENDPOINT,
    apiKey: process.env.HYPERTRACE_API_KEY || '',
    serviceName: 'github-actions-e2e-test'
  })
})
