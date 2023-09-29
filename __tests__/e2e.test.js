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
const getConfig_1 = __importDefault(require("../src/getConfig"));
const action_1 = require("../src/action");
dotenv_1.default.config();
(0, skipUnlessE2E_1.skipUnlessE2E)();
(0, globals_1.it)('Should fetch logs for a given run ID', () => __awaiter(void 0, void 0, void 0, function* () {
    const env = (0, getConfig_1.default)();
    const logs = yield (0, action_1.traceJobs)({
        githubToken: env.githubToken,
        githubOwner: env.githubOwner,
        githubRepo: env.githubRepo,
        githubRunId: env.githubRunId,
        apiKey: env.apiKey
    });
}));
