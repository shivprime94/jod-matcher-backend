/**
 * Utility functions for fuzzy search capabilities
 */

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
  }

  return dp[m][n];
}

// Check if two strings are similar enough based on a threshold
function isSimilar(str1, str2, threshold = 0.3) {
  if (!str1 || !str2) return false;
  
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Exact match
  if (s1 === s2) return true;
  
  // If one string contains the other
  if (s1.includes(s2) || s2.includes(s1)) return true;
  
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  const similarity = 1 - distance / maxLength;
  
  return similarity >= threshold;
}

module.exports = {
  levenshteinDistance,
  isSimilar
};
