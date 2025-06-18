#include <iostream>
#include <set>
#include <vector>
#include <cmath>
using namespace std;

// Function to check if a number is palindrome
bool isPalindrome(long long n) {
    if (n < 0) return false;
    long long rev = 0, orig = n;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    return rev == orig;
}

// Function to calculate sum of squares in arithmetic progression
long long sumOfSquares(long long start, long long d, long long len) {
    long long sum = 0;
    for (long long i = 0; i < len; i++) {
        long long term = start + i * d;
        if (term <= 0) return -1; // Invalid term
        sum += term * term;
        if (sum > 1e10) return -1; // Exceeds N limit
    }
    return sum;
}

void solve() {
    long long N, d;
    cin >> N >> d;
    
    set<long long> palindromes;
    
    // Try all possible starting points
    for (long long start = 1; start * start < N; start++) {
        // Try all possible sequence lengths (at least 2)
        for (long long len = 2; ; len++) {
            long long sum = sumOfSquares(start, d, len);
            if (sum == -1 || sum >= N) break;
            if (isPalindrome(sum)) {
                palindromes.insert(sum);
            }
        }
    }
    
    // Calculate final sum
    long long result = 0;
    for (long long x : palindromes) {
        result += x;
    }
    cout << result << endl;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    
    int T;
    cin >> T;
    while (T--) {
        solve();
    }
    return 0;
} 