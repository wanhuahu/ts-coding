function getMinimumSum(arr: number[]): number {
 const n = arr.length;
 if (n < 3) return -1;

 let minSum = Infinity;

 // Precompute the smallest element to the left of i that is less than arr[i]
 const leftMin: number[] = new Array(n).fill(Infinity);
 for (let i = 1; i < n; i++) {
     for (let j = 0; j < i; j++) {
         if (arr[j] < arr[i] && arr[j] < leftMin[i]) {
             leftMin[i] = arr[j];
         }
     }
 }

 // Precompute the smallest element to the right of i that is less than arr[i]
 const rightMin: number[] = new Array(n).fill(Infinity);
 for (let i = n - 2; i >= 0; i--) {
     for (let j = i + 1; j < n; j++) {
         if (arr[j] < arr[i] && arr[j] < rightMin[i]) {
             rightMin[i] = arr[j];
         }
     }
 }

 // Check each possible middle element
 for (let i = 1; i < n - 1; i++) {
     if (leftMin[i] !== Infinity && rightMin[i] !== Infinity) {
         const currentSum = leftMin[i] + arr[i] + rightMin[i];
         if (currentSum < minSum) {
             minSum = currentSum;
         }
     }
 }

 return minSum !== Infinity ? minSum : -1;
}
console.log(getMinimumSum([3, 4, 5, 1, 2, 3, 1]));
