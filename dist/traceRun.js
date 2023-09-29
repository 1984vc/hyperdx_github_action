"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceRun = void 0;
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const api_1 = require("@opentelemetry/api");
const DEFAULT_ENDPOINT = "https://in-otel.hyperdx.io";
const traceRun = (jobs, apiKey, opts) => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = (opts === null || opts === void 0 ? void 0 : opts.endpoint) || DEFAULT_ENDPOINT;
    const exporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({
        url: `${endpoint}/v1/traces`,
        headers: {
            "authorization": apiKey
        },
    });
    const provider = new sdk_trace_base_1.BasicTracerProvider({
        resource: new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: 'github-actions',
        }),
    });
    provider.addSpanProcessor(new sdk_trace_base_1.SimpleSpanProcessor(exporter));
    provider.register();
    const tracer = api_1.trace.getTracer('runJobs');
    for (const job of jobs) {
        const parentSpan = tracer.startSpan('Run', { startTime: new Date(Date.parse(job.started_at)) });
        parentSpan.setAttribute('runId', job.run_id);
        if (job.steps) {
            for (const step of job.steps) {
                const ctx = api_1.trace.setSpan(api_1.context.active(), parentSpan);
                const startTime = step.started_at ? new Date(Date.parse(step.started_at)) : undefined;
                const endTime = step.completed_at ? new Date(Date.parse(step.completed_at)) : undefined;
                const stepSpan = tracer.startSpan(step.name, { startTime }, ctx);
                stepSpan.setAttribute('status', step.status);
                if (step.conclusion)
                    stepSpan.setAttribute('conclusion', step.conclusion);
                stepSpan.end(endTime);
            }
        }
        const jobEndTime = job.completed_at ? new Date(Date.parse(job.completed_at)) : undefined;
        parentSpan.end(jobEndTime);
    }
    return yield exporter.shutdown();
});
exports.traceRun = traceRun;
