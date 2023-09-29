import * as core from '@actions/core'
import getConfig from './getConfig'

import {traceJobs} from './action'

async function run(): Promise<void> {
  try {
    const config = getConfig()
    await traceJobs(config)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
