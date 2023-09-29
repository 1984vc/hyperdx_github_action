import getConfig, {ActionConfig, DEFAULT_ENDPOINT} from '../getConfig'
import {it, describe, expect} from '@jest/globals'

describe('getConfig', () => {
  it('should return the correct config object', () => {
    const expectedConfig: ActionConfig = {
      endpoint: DEFAULT_ENDPOINT,
      apiKey: 'abc123',
      serviceName: 'github-actions',
      githubToken: 'def456',
      githubOwner: 'mdp',
      githubRepo: 'hyperdxtrace',
      githubRunId: '789'
    }
    process.env.HYPERDX_API_KEY = expectedConfig.apiKey
    process.env.GITHUB_TOKEN = expectedConfig.githubToken
    process.env.GITHUB_REPOSITORY = 'mdp/hyperdxtrace'
    process.env.GITHUB_RUN_ID = expectedConfig.githubRunId

    const actualConfig = getConfig()
    expect(actualConfig).toEqual(expectedConfig)
  })
})
