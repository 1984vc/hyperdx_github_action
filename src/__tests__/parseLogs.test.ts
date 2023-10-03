// Write tests for the parseLog function here
// You should test for:
// - The function should return an array of JSON objects
// - The JSON objects should have the correct keys
// - The JSON objects should have the correct values
// - The function should handle empty lines
import {readFile} from 'fs/promises'
import {join} from 'path'
import {it, expect} from '@jest/globals'

import {parseLog} from '../logRun'

it('should return an array of JSON objects', async () => {
  const log = `2023-07-25T17:52:33.2641972Z Requested labels: ubuntu-latest
2023-07-25T17:52:33.2642330Z Job defined at: mdp/foo/.github/workflows/test.yaml@refs/heads/mdp/actions
2023-07-25T17:52:33.2642505Z Waiting for a runner to pick up this job...
2023-07-25T17:52:33.9473112Z Job is waiting for a hosted runner to come online.
2023-07-25T17:52:38.4401660Z Job is about to start running on the hosted runner: GitHub Actions 2 (hosted)
2023-07-25T17:52:43.4781579Z Current runner version: '2.306.0'
2023-07-25T17:52:43.4815226Z ##[group]Operating System
2023-07-25T17:52:43.4815952Z Ubuntu
2023-07-25T17:52:43.4816959Z 22.04.2
2023-07-25T17:52:43.4817592Z LTS
2023-07-25T17:52:43.4818254Z ##[endgroup]
2023-07-25T17:52:43.4818712Z ##[group]Runner Image
2023-07-25T17:52:43.4819345Z Image: ubuntu-22.04
2023-07-25T17:52:43.4819985Z Version: 20230716.1.0
2023-07-25T17:52:43.4820646Z Included Software: https://github.com/actions/runner-images/blob/ubuntu22/20230716.1/images/linux/Ubuntu2204-Readme.md
2023-07-25T17:52:43.4821380Z Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu22%2F20230716.1
2023-07-25T17:52:43.4821923Z ##[endgroup]
`
  const result = parseLog(log)
  expect(Array.isArray(result)).toBe(true)
  expect(result).toHaveLength(3)
  expect(result[0]._timestamp).toBe(1690307553264) // 2023-07-25T17:52:33.2641972Z  mtimek
})

it('should return ignore invalid dates', () => {
  const log =
    '2023-07-25T13:BA:09.123456Z [INFO] [elastic] [run.py:main:25] [metadata_url] This is an invalid timestamp'
  const result = parseLog(log)
  expect(result).toHaveLength(1)
  expect(result[0]._timestamp).toBeUndefined()
})

it('should still handle blank log lines', () => {
  const log = '2023-07-25T13:18:09.1418054Z '
  const result = parseLog(log)
  expect(result).toHaveLength(1)
  expect(result[0].log).toEqual(log)
})

it(`should read from the fixtures log file,
  parse the contents and generate the correct groups`, async () => {
  const logs = await readFile(
    join(__dirname, 'fixtures', 'jobsLogsList.txt'),
    'utf8'
  )
  const result = parseLog(logs)
  expect(result).toHaveLength(19)
})
