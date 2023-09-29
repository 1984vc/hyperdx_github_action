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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const getConfig = () => {
    const githubToken = process.env.GITHUB_TOKEN || core.getInput('github_token');
    if (!githubToken) {
        throw new Error('GITHUB_TOKEN env variable is missing');
    }
    const fullRepository = process.env.GITHUB_REPOSITORY;
    if (!fullRepository) {
        throw new Error('Missing GITHUB_REPOSITORY env variable');
    }
    const [githubOwner, githubRepo] = fullRepository.split('/');
    const githubRunId = process.env.GITHUB_RUN_ID;
    if (!githubRunId) {
        throw new Error('GITHUB_RUN_ID missing');
    }
    const endpoint = process.env.HYPERDX_ENDPOINT || core.getInput('hyperdx_endpoint') || "https://in-otel.hyperdx.io";
    const apiKey = process.env.HYPERDX_API_KEY || core.getInput('hyperdx_api_key');
    if (!apiKey) {
        throw new Error('Missing HyperDX credentials');
    }
    return {
        githubOwner,
        githubRepo,
        githubToken,
        githubRunId,
        endpoint,
        apiKey: apiKey
    };
};
exports.default = getConfig;
