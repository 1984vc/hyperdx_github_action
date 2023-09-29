import * as github from '@actions/github'
import {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods'
import {ActionConfig} from './getConfig'
import {traceRun} from './traceRun'

export type GithubActionRun =
  RestEndpointMethodTypes['actions']['listJobsForWorkflowRun']['response']['data']

export const traceJobs = async (config: ActionConfig): Promise<void> => {
  const jobs = await fetchCompletedJobs(
    config.githubToken,
    config.githubOwner,
    config.githubRepo,
    parseInt(config.githubRunId, 10)
  )
  await traceRun(jobs, {apiKey: config.apiKey, endpoint: config.endpoint, serviceName: config.serviceName })
}

export const fetchCompletedJobs = async (
  githubToken: string,
  githubOwner: string,
  githubRepo: string,
  githubRunId: number
): Promise<GithubActionRun['jobs']> => {
  const octokit = github.getOctokit(githubToken)

  const jobRequest = await octokit.rest.actions.listJobsForWorkflowRun({
    owner: githubOwner,
    repo: githubRepo,
    run_id: githubRunId
  })

  const jobs = jobRequest.data.jobs
  const jobsDone = jobs.filter(job => job.status === 'completed')
  return jobsDone as GithubActionRun['jobs']
}
