"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipUnlessE2E = exports.isE2E = void 0;
const globals_1 = require("@jest/globals");
function isE2E() {
    return process.env.E2E === '1';
}
exports.isE2E = isE2E;
function skipUnlessE2E() {
    if (!isE2E()) {
        globals_1.it.only('does not work on unless E2E is set', () => { });
    }
}
exports.skipUnlessE2E = skipUnlessE2E;
