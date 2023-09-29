"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.fetchCompletedJobs = exports.traceJobs = void 0;
const github = __importStar(require("@actions/github"));
const traceRun_1 = require("./traceRun");
const traceJobs = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = github.getOctokit(config.githubToken);
    const jobs = yield (0, exports.fetchCompletedJobs)(config.githubToken, config.githubOwner, config.githubRepo, parseInt(config.githubRunId, 10));
    yield (0, traceRun_1.traceRun)(jobs, config.apiKey, { endpoint: config.endpoint });
});
exports.traceJobs = traceJobs;
const fetchCompletedJobs = (githubToken, githubOwner, githubRepo, githubRunId) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = github.getOctokit(githubToken);
    const jobRequest = yield octokit.rest.actions.listJobsForWorkflowRun({
        owner: githubOwner,
        repo: githubRepo,
        run_id: githubRunId
    });
    const jobs = jobRequest.data.jobs;
    const jobsDone = jobs.filter(job => job.status === 'completed');
    return jobsDone;
});
exports.fetchCompletedJobs = fetchCompletedJobs;
