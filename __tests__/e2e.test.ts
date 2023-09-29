import dotenv from 'dotenv'
import {it, expect} from '@jest/globals'

import {skipUnlessE2E} from './helpers/skipUnlessE2E'
import getConfig from '../src/getConfig'
import {traceJobs} from '../src/action'

dotenv.config()

skipUnlessE2E()

it('Should fetch logs for a given run ID', async () => {
  const env = getConfig()
  const logs = await traceJobs({
    githubToken: env.githubToken,
    githubOwner: env.githubOwner,
    githubRepo: env.githubRepo,
    githubRunId: env.githubRunId,
    apiKey: env.apiKey
  })
})
