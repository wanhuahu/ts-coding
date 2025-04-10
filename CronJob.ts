type CronExpression = string | {
  second?: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
};

type Task = () => Promise<void> | void;

interface CronJob {
  id: string;
  expression: CronExpression;
  task: Task;
  isRunning: boolean;
  timeoutId?: NodeJS.Timeout;
}

class CronScheduler {
  private jobs: CronJob[] = [];
  private readonly defaultSecond = '0';

  /**
   * Add a new cron job
   * @param expression - Cron expression (string or object)
   * @param task - Task to execute
   * @returns Job ID
   */
  addJob(expression: CronExpression, task: Task): string {
    const id = this.generateId();
    const job: CronJob = {
      id,
      expression,
      task,
      isRunning: true
    };
    
    this.jobs.push(job);
    this.scheduleJob(job);
    return id;
  }

  /**
   * Remove a cron job
   * @param id - Job ID to remove
   */
  removeJob(id: string): void {
    const jobIndex = this.jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) return;

    const job = this.jobs[jobIndex];
    if (job.timeoutId) {
      clearTimeout(job.timeoutId);
    }
    
    this.jobs.splice(jobIndex, 1);
  }

  /**
   * Start a stopped cron job
   * @param id - Job ID to start
   */
  startJob(id: string): void {
    const job = this.jobs.find(job => job.id === id);
    if (!job || job.isRunning) return;

    job.isRunning = true;
    this.scheduleJob(job);
  }

  /**
   * Stop a running cron job
   * @param id - Job ID to stop
   */
  stopJob(id: string): void {
    const job = this.jobs.find(job => job.id === id);
    if (!job || !job.isRunning) return;

    job.isRunning = false;
    if (job.timeoutId) {
      clearTimeout(job.timeoutId);
      delete job.timeoutId;
    }
  }

  /**
   * Stop all cron jobs and clear the scheduler
   */
  shutdown(): void {
    this.jobs.forEach(job => {
      if (job.timeoutId) {
        clearTimeout(job.timeoutId);
      }
    });
    this.jobs = [];
  }

  private scheduleJob(job: CronJob): void {
    if (!job.isRunning) return;

    const nextRun = this.getNextRunTime(job.expression);
    const now = new Date();
    const delay = nextRun.getTime() - now.getTime();

    job.timeoutId = setTimeout(async () => {
      try {
        await job.task();
      } catch (error) {
        console.error(`Error executing cron job ${job.id}:`, error);
      } finally {
        if (job.isRunning) {
          this.scheduleJob(job);
        }
      }
    }, Math.max(0, delay));
  }

  private getNextRunTime(expression: CronExpression): Date {
    const parsed = this.parseExpression(expression);
    const now = new Date();
    let nextRun = new Date(now);

    // Set to next second
    nextRun.setMilliseconds(0);
    nextRun.setSeconds(nextRun.getSeconds() + 1);

    while (true) {
      if (
        this.matchesField(nextRun.getSeconds().toString(), parsed.second) &&
        this.matchesField(nextRun.getMinutes().toString(), parsed.minute) &&
        this.matchesField(nextRun.getHours().toString(), parsed.hour) &&
        this.matchesField(nextRun.getDate().toString(), parsed.dayOfMonth) &&
        this.matchesField((nextRun.getMonth() + 1).toString(), parsed.month) &&
        this.matchesField(nextRun.getDay().toString(), parsed.dayOfWeek)
      ) {
        return nextRun;
      }

      // Move to next minute if no match
      nextRun.setSeconds(nextRun.getSeconds() + 1);
      
      // If we've moved into the next hour, check if we need to roll over
      if (nextRun.getSeconds() >= 60) {
        nextRun.setSeconds(0);
        nextRun.setMinutes(nextRun.getMinutes() + 1);
      }
    }
  }

  private parseExpression(expression: CronExpression): {
    second: string;
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
  } {
    if (typeof expression === 'string') {
      const parts = expression.split(/\s+/);
      if (parts.length === 5) {
        // Standard cron expression (minute, hour, dayOfMonth, month, dayOfWeek)
        return {
          second: this.defaultSecond,
          minute: parts[0],
          hour: parts[1],
          dayOfMonth: parts[2],
          month: parts[3],
          dayOfWeek: parts[4]
        };
      } else if (parts.length === 6) {
        // Extended cron expression with seconds
        return {
          second: parts[0],
          minute: parts[1],
          hour: parts[2],
          dayOfMonth: parts[3],
          month: parts[4],
          dayOfWeek: parts[5]
        };
      } else {
        throw new Error('Invalid cron expression format');
      }
    } else {
      return {
        second: expression.second || this.defaultSecond,
        minute: expression.minute,
        hour: expression.hour,
        dayOfMonth: expression.dayOfMonth,
        month: expression.month,
        dayOfWeek: expression.dayOfWeek
      };
    }
  }

  private matchesField(value: string, field: string): boolean {
    if (field === '*') return true;
    
    const parts = field.split(',');
    for (const part of parts) {
      if (part === value) return true;
      
      // Handle ranges (1-5)
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        const numValue = Number(value);
        if (numValue >= start && numValue <= end) return true;
      }
      
      // Handle steps (*/5)
      if (part.includes('/')) {
        const [range, step] = part.split('/');
        const stepNum = Number(step);
        
        if (range === '*') {
          if (Number(value) % stepNum === 0) return true;
        } else if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          const numValue = Number(value);
          if (numValue >= start && numValue <= end && (numValue - start) % stepNum === 0) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}

// Example usage:
const scheduler = new CronScheduler();

// Add a job that runs every minute
const jobId1 = scheduler.addJob('* * * * *', () => {
  console.log('Running every minute:', new Date().toISOString());
});

// Add a job that runs every 5 minutes
const jobId2 = scheduler.addJob('*/5 * * * *', () => {
  console.log('Running every 5 minutes:', new Date().toISOString());
});

// Add a job with object syntax that runs every day at 3:30 AM
const jobId3 = scheduler.addJob({
  minute: '30',
  hour: '3',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '*'
}, () => {
  console.log('Running daily at 3:30 AM:', new Date().toISOString());
});

// Stop a job after 10 seconds
setTimeout(() => {
  scheduler.stopJob(jobId1);
  console.log('Stopped the every-minute job');
}, 10000);

// Shutdown all jobs after 1 minute
setTimeout(() => {
  scheduler.shutdown();
  console.log('Shutdown all jobs');
}, 60000);
