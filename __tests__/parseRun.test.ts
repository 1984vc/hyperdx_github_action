import dotenv from 'dotenv'
import {readFile} from 'fs/promises'
import {join} from 'path'

import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http'
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-base'
import {Resource} from '@opentelemetry/resources'
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions'
import {trace, context} from '@opentelemetry/api'

import {it} from '@jest/globals'

import {traceRun} from '../src/traceRun'
import {skipUnlessE2E} from './helpers/skipUnlessE2E'
import {GithubActionRun} from '../src/action'

dotenv.config()

skipUnlessE2E()

// Make the fixture timestamps relative to the current time
function fixTimestamps(run: GithubActionRun): GithubActionRun {
  const currentTime = new Date().getTime()
  run.jobs.forEach(job => {
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
      job.steps.forEach(step => {
        if (step.started_at)
          step.started_at = new Date(
            Date.parse(step.started_at) + offset
          ).toISOString()
        if (step.completed_at)
          step.completed_at = new Date(
            Date.parse(step.completed_at) + offset
          ).toISOString()
      })
    }
  })
  return run
}

it('Send job data to OTLP as a trace', async () => {})
