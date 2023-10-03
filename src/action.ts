import * as github from '@actions/github'
import {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods'
import {ActionConfig} from './getConfig'
import {traceRun} from './traceRun'
import {Log, logRun, parseLog} from './logRun'

export type GithubActionRun =
  RestEndpointMethodTypes['actions']['listJobsForWorkflowRun']['response']['data']

export const traceJobs = async (config: ActionConfig): Promise<void> => {
  const jobs = await fetchCompletedJobs(
    config.githubToken,
    config.githubOwner,
    config.githubRepo,
    config.githubRunId
  )

  for (const job of jobs) {
    const traceId = await traceRun(job, {
      apiKey: config.apiKey,
      endpoint: config.endpoint,
      serviceName: config.serviceName
    })
    if (traceId) {
      const logs = await fetchRunLogs(
        config.githubToken,
        config.githubOwner,
        config.githubRepo,
        config.githubRunId
      )
      await logRun(logs[job.id], traceId, {
        apiKey: config.apiKey,
        endpoint: config.endpoint,
        serviceName: config.serviceName
      })
    }
  }
}

export const fetchCompletedJobs = async (
  githubToken: string,
  githubOwner: string,
  githubRepo: string,
  githubRunId: string
): Promise<GithubActionRun['jobs']> => {
  const octokit = github.getOctokit(githubToken)

  const jobRequest = await octokit.rest.actions.listJobsForWorkflowRun({
    owner: githubOwner,
    repo: githubRepo,
    run_id: parseInt(githubRunId, 10)
  })

  const jobs = jobRequest.data.jobs
  const jobsDone = jobs.filter(job => job.status === 'completed')
  return jobsDone as GithubActionRun['jobs']
}

export const fetchRunLogs = async (
  githubToken: string,
  githubOwner: string,
  githubRepo: string,
  githubRunId: string
): Promise<{[key: string]: Log[]}> => {
  const octokit = github.getOctokit(githubToken)

  console.log('fetchRunLogs', githubOwner, githubRepo, githubRunId)
  const jobRequest = await octokit.rest.actions.listJobsForWorkflowRun({
    owner: githubOwner,
    repo: githubRepo,
    run_id: parseInt(githubRunId, 10)
  })
  const jobs = jobRequest.data.jobs
  const jobsDone = jobs.filter(job => job.status === 'completed')
  const jobLogs: {[key: string]: Log[]} = {}
  for (const job of jobsDone) {
    const response = await octokit.rest.actions.downloadJobLogsForWorkflowRun({
      owner: githubOwner,
      repo: githubRepo,
      job_id: job.id
    })
    jobLogs[job.id] ||= []
    jobLogs[job.id].push(...parseLog(response.data as string))
  }
  console.log('jobLogs', jobLogs)
  return jobLogs
}
