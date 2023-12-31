import * as core from '@actions/core'

export type ActionConfig = {
  endpoint: string
  apiKey: string
  githubToken: string
  githubOwner: string
  githubRepo: string
  githubRunId: string
  serviceName: string
}

export const DEFAULT_ENDPOINT = 'https://in-otel.hyperdx.io'

const getConfig = (): ActionConfig => {
  const githubToken = process.env.GITHUB_TOKEN || core.getInput('github_token')
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN env variable is missing')
  }

  const fullRepository = process.env.GITHUB_REPOSITORY
  if (!fullRepository) {
    throw new Error('Missing GITHUB_REPOSITORY env variable')
  }

  const [githubOwner, githubRepo] = fullRepository.split('/')
  const githubRunId = process.env.GITHUB_RUN_ID
  if (!githubRunId) {
    throw new Error('GITHUB_RUN_ID missing')
  }

  const endpoint =
    process.env.HYPERDX_ENDPOINT ||
    core.getInput('hyperdx_endpoint') ||
    DEFAULT_ENDPOINT
  const apiKey = process.env.HYPERDX_API_KEY || core.getInput('hyperdx_api_key')

  if (!apiKey) {
    throw new Error('Missing HyperDX credentials')
  }

  const serviceName =
    process.env.HYPERDX_SERVICE_NAME ||
    core.getInput('hyperdx_service_name') ||
    'github-actions'

  return {
    githubOwner,
    githubRepo,
    githubToken,
    githubRunId,
    endpoint,
    serviceName,
    apiKey
  }
}

export default getConfig
