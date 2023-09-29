import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http'
import {
  BasicTracerProvider,
  SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-base'
import {Resource} from '@opentelemetry/resources'
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions'
import {trace, context} from '@opentelemetry/api'
import {GithubActionRun} from './action'

type TraceConfig = {
  endpoint: string
  serviceName: string
  apiKey: string
}

export const traceRun = async (
  jobs: GithubActionRun['jobs'],
  config: TraceConfig
): Promise<void> => {
  const endpoint = config.endpoint
  const exporter = new OTLPTraceExporter({
    url: `${endpoint}/v1/traces`,
    headers: {
      authorization: config.apiKey
    }
  })

  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName
    })
  })
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
  provider.register()
  const tracer = trace.getTracer('runJobs')

  for (const job of jobs) {
    const parentSpan = tracer.startSpan('Run', {
      startTime: new Date(Date.parse(job.started_at))
    })
    parentSpan.setAttribute('runId', job.run_id)
    if (job.steps) {
      for (const step of job.steps) {
        const ctx = trace.setSpan(context.active(), parentSpan)
        const startTime = step.started_at
          ? new Date(Date.parse(step.started_at))
          : undefined
        const endTime = step.completed_at
          ? new Date(Date.parse(step.completed_at))
          : undefined
        const stepSpan = tracer.startSpan(step.name, {startTime}, ctx)
        stepSpan.setAttribute('status', step.status)
        if (step.conclusion)
          stepSpan.setAttribute('conclusion', step.conclusion)
        stepSpan.end(endTime)
      }
    }
    const jobEndTime = job.completed_at
      ? new Date(Date.parse(job.completed_at))
      : undefined
    parentSpan.end(jobEndTime)
  }
  return await exporter.shutdown()
}
