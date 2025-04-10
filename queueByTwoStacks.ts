class QueueWithStacks<T> {
  private stack1: T[] = [];
  private stack2: T[] = [];

  // Time: O(1); Space: O(n)
  enqueue(item: T): void {
    this.stack1.push(item);
  }

  // Time: O(1) and worst O(n); Space: O(n)
  dequeue(): T | undefined {
    if (this.stack2.length === 0) {
      while (this.stack1.length > 0) {
        const item = this.stack1.pop();
        if (item !== undefined) {
          this.stack2.push(item);
        }
      }
    }
    
    return this.stack2.pop();
  }

  peek(): T | undefined {
    if (this.stack2.length === 0) {
      while (this.stack1.length > 0) {
        const item = this.stack1.pop();
        if (item !== undefined) {
          this.stack2.push(item);
        }
      }
    }

    return this.stack2[this.stack2.length - 1];
  }
}

const queue = new QueueWithStacks<number>();
console.log(queue.peek());
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue()); // output 1
queue.enqueue(3);
queue.enqueue(4);
console.log(queue.dequeue()); // output 2
