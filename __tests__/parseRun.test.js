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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const globals_1 = require("@jest/globals");
const skipUnlessE2E_1 = require("./helpers/skipUnlessE2E");
dotenv_1.default.config();
(0, skipUnlessE2E_1.skipUnlessE2E)();
// Make the fixture timestamps relative to the current time
function fixTimestamps(run) {
    const currentTime = new Date().getTime();
    run.jobs.forEach(job => {
        const jobEnded = job.completed_at
            ? new Date(Date.parse(job.completed_at)).getTime()
            : currentTime;
        const offset = currentTime - jobEnded;
        job.started_at = new Date(Date.parse(job.started_at) + offset).toISOString();
        if (job.completed_at)
            job.completed_at = new Date(Date.parse(job.completed_at) + offset).toISOString();
        if (job.steps) {
            job.steps.forEach(step => {
                if (step.started_at)
                    step.started_at = new Date(Date.parse(step.started_at) + offset).toISOString();
                if (step.completed_at)
                    step.completed_at = new Date(Date.parse(step.completed_at) + offset).toISOString();
            });
        }
    });
    return run;
}
(0, globals_1.it)('Send job data to OTLP as a trace', () => __awaiter(void 0, void 0, void 0, function* () { }));
