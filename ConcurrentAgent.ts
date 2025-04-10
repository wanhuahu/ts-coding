type Task<T> = () => Promise<T>;


interface ConcurrentAgentOptions {
 maxConcurrency: number;
 onTaskCompleted?: <T>(result: T) => void;
 onTaskFailed?: (error: unknown) => void;
}


class ConcurrentAgent {
 private queue: Array<{ task: Task<unknown>; resolve: (value: unknown) => void; reject: (reason?: any) => void }> = [];
 private activeCount = 0;
 private maxConcurrency: number;
 private onTaskCompleted?: <T>(result: T) => void;
 private onTaskFailed?: (error: unknown) => void;


 constructor(options: ConcurrentAgentOptions) {
   this.maxConcurrency = options.maxConcurrency;
   this.onTaskCompleted = options.onTaskCompleted;
   this.onTaskFailed = options.onTaskFailed;
 }


 public async execute<T>(task: Task<T>): Promise<T> {
   return new Promise<T>((resolve, reject) => {
     this.queue.push({
       task: task as Task<unknown>,
       resolve: resolve as (value: unknown) => void,
       reject
     });
     this.processNext();
   });
 }


 private processNext(): void {
   if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) {
     return;
   }


   this.activeCount++;
   const { task, resolve, reject } = this.queue.shift()!;


   task()
     .then(result => {
       resolve(result);
       if (this.onTaskCompleted) {
         this.onTaskCompleted(result);
       }
     })
     .catch(error => {
       reject(error);
       if (this.onTaskFailed) {
         this.onTaskFailed(error);
       }
     })
     .finally(() => {
       this.activeCount--;
       this.processNext();
     });
 }


 public getQueueLength(): number {
   return this.queue.length;
 }


 public getActiveCount(): number {
   return this.activeCount;
 }
}


// Example usage:
async function main() {
 // Create an agent with max concurrency of 3
 const agent = new ConcurrentAgent({
   maxConcurrency: 3,
   onTaskCompleted: (result) => console.log('Task completed with result:', result),
   onTaskFailed: (error) => console.error('Task failed:', error)
 });


 // Simulate some async tasks
 function createTask(id: number, duration: number, shouldFail = false): Task<string> {
   return () => new Promise((resolve, reject) => {
     setTimeout(() => {
       if (shouldFail) {
         reject(`Task ${id} failed`);
       return;
       }
       resolve(`Result from task ${id}`);
     }, duration);
   });
 }


 // Add 10 tasks with varying durations
 const tasks: Promise<string>[] = [];
 for (let i = 1; i <= 10; i++) {
   const duration = Math.random() * 2000 + 500; // 500-2500ms
   const shouldFail = i % 4 === 0; // Fail every 4th task
   console.log(`Adding task ${i} (${duration.toFixed(0)}ms)`);
   tasks.push(agent.execute(createTask(i, duration, shouldFail)));
 }


 // Wait for all tasks to complete
 try {
   const results = await Promise.allSettled(tasks);
   console.log('All tasks completed:');
   results.forEach((result, index) => {
     if (result.status === 'fulfilled') {
       console.log(`Task ${index + 1}: Success - ${result.value}`);
     } else {
       console.log(`Task ${index + 1}: Failed - ${result.reason}`);
     }
   });
 } catch (error) {
   console.error('Unexpected error:', error);
 }
}


main().catch(console.error);
