import {HyperDXWinston} from '@hyperdx/node-logger'
import {TraceConfig} from './traceRun'

export const logRun = async (
  logs: Log[],
  traceId: string,
  config: TraceConfig
) => {
  const getCustomMeta = () => {
    return {
      trace_id: traceId
    }
  }
  const logger = new HyperDXWinston({
    apiKey: config.apiKey,
    service: config.serviceName,
    getCustomMeta
  })
  for (const log of logs) {
    logger.log({message: log.log || '', level: 'info'}, () => {})
  }
  await new Promise(resolve => logger.finish(resolve))
}

export type Log = {
  _timestamp?: number
  log: string | null
}

enum GroupIndicators {
  Begin = 1,
  End,
  Noop
}

const getLineGroupIndicator = (line: string): GroupIndicators => {
  const msg = line.slice(29)
  if (msg.match(/^##\[group\]/)) {
    return GroupIndicators.Begin
  }
  if (msg.match(/^##\[[a-zA-Z0-9]+\]/)) {
    return GroupIndicators.End
  }
  return GroupIndicators.Noop
}

const parseTimestamp = (line: string): number | null => {
  const d = new Date(line.slice(0, 28))
  if (d instanceof Date && !isNaN(d.getTime())) {
    return d.getTime()
  }
  // Invalid date
  return null
}

// Read in a log file and parse it into a JSON object
// Log file will be in the format: [timestamp] [message] \n
export const parseLog = (logs: string): Log[] => {
  const lines = logs.split('\n')
  let groupIdx = 0
  const group: Log[] = []
  for (const line of lines) {
    if (line.trim().length === 0) {
      continue
    }
    const groupIndicator = getLineGroupIndicator(line)
    if (groupIndicator === GroupIndicators.Begin) {
      if (group[groupIdx]) {
        // Only advance to next group if there's a current group
        groupIdx = groupIdx + 1
      }
    }

    // Create the group log holder
    if (!group[groupIdx]) {
      const logItem: Log = {
        log: line
      }
      const timestamp = parseTimestamp(line)
      if (timestamp) logItem._timestamp = timestamp
      group[groupIdx] = logItem
    } else {
      group[groupIdx].log = `${group[groupIdx].log}\n${line}`
    }

    // AFTER the ending indicator, start a new group (keep the current line in the current group)
    if (groupIndicator === GroupIndicators.End) {
      groupIdx = groupIdx + 1
    }
  }

  return group
}
