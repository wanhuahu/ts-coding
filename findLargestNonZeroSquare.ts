//Find the biggest square of non-0 values in a quadratic matrix.
function findLargestNonZeroSquare(matrix: number[][]): number {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }

    const rows = matrix.length;
    const cols = matrix[0].length;
    
    // Create a DP table initialized with 0
    const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
    let maxSize = 0;

    // Fill the first row and first column of DP table
    for (let i = 0; i < rows; i++) {
        dp[i][0] = matrix[i][0] !== 0 ? 1 : 0;
        maxSize = Math.max(maxSize, dp[i][0]);
    }
    
    for (let j = 0; j < cols; j++) {
        dp[0][j] = matrix[0][j] !== 0 ? 1 : 0;
        maxSize = Math.max(maxSize, dp[0][j]);
    }

    // Fill the rest of the DP table
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (matrix[i][j] !== 0) {
                dp[i][j] = Math.min(
                    dp[i-1][j],
                    dp[i][j-1],
                    dp[i-1][j-1]
                ) + 1;
                maxSize = Math.max(maxSize, dp[i][j]);
            }
        }
    }

    return maxSize;
}

// Example usage:
const matrix = [
    [1, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0]
];

console.log(findLargestNonZeroSquare(matrix)); // Output: 3 (3x3 square of 1s)
