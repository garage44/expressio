import notifier from 'node-notifier'
import pc from 'picocolors'
import {performance} from 'perf_hooks'

export class Task {

    constructor(title, execute) {
        this.title = title

        this.execute = execute
        this.prefix = {
            error: pc.bold(pc.red(`[${this.title}]`.padEnd(20, ' '))),
            ok: pc.bold(pc.green(`[${this.title}]`.padEnd(20, ' '))),
        }
    }

    log(...args) {
        // eslint-disable-next-line no-console
        console.log(...args)
    }

    async start(...args) {
        this.startTime = performance.now()
        const logStart = `${this.prefix.ok}${pc.gray('task started')}`
        this.log(logStart)
        let result

        try {
            result = await this.execute(...args)
            if (result && result.size) {
                if (result.size < 1024) {
                    this.size = `${result.size}B`
                } else if (result.size < Math.pow(1024, 2)) {
                    this.size = `${Number(result.size / 1024).toFixed(2)}KiB`
                } else {
                    this.size = `${Number(result.size / Math.pow(1024, 2)).toFixed(2)}MiB`
                }
            }
        } catch (err) {
            this.log(`${this.prefix.error}task failed\n${err}`)
            notifier.notify({
                message: `${err}`,
                title: `Task ${this.title} failed!`,
            })
        }

        this.endTime = performance.now()
        this.spendTime = `${Number(this.endTime - this.startTime).toFixed(1)}ms`

        let logComplete = `${this.prefix.ok}task completed`

        logComplete += ` (${pc.bold(this.spendTime)}`
        if (this.size) logComplete += `, ${pc.bold(this.size)}`
        logComplete += ')'

        this.log(logComplete)

        return result
    }
}
