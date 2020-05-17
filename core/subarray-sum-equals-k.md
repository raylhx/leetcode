# 和为 K 的子数组

描述：给定一个整数数组和一个整数 k，你需要找到该数组中和为 k 的连续的子数组的个数。  
难度：中  
原题地址：https://leetcode-cn.com/problems/subarray-sum-equals-k/

**示例 1 :**

> 输入: nums = [1,1,1], k = 2  
> 输出: 2 , [1,1] 与 [1,1] 为两种不同的情况。

**说明 :**

1.数组的长度为 [1, 20,000]。  
2.数组中元素的范围是 [-1000, 1000] ，且整数 k 的范围是 [-1e7, 1e7]。

# Done

## 两次 for 暴力

- 时间复杂度 O(n^2)

固定一个起点 i，从 i 往后累加，直到第 j 项中，出现累加和为给定值 k，这个 j 在数组长度限制 length 之前，可能会有多个。这里使用了一个变量 sum 记录累加和。在内层 for 循环中，sum 累加了从 i 到 j-1 项中的和。

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
  let counter = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) counter++;
    }
  }
  return counter;
};
```

## 前缀和

- 时间复杂度 O(n)
- 执行用时 84 ms
- 内存消耗 40.3 MB
除了刚刚暴力解法，还学到了一种很巧妙的方法：前缀和 + 哈希表

前缀和：从 第 0 项 到 当前项 的总和

prefixSum 表示前缀和数组，nums 是给定查找的数组

prefixSum[x] = nums[0] + nums[1] + ... + nums[x]

将公式移项
nums[x] = prefixSum[x] - (nums[0] + nums[1] + ... + nums[x - 1])
其实也就是：
nums[x] = prefixSum[x] - prefixSum[x - 1]

假设有 0 <= i <= j < length，i 和 j 都是数组 sums 下标

对于 i 来说：nums[i] = prefixSum[i] - prefixSum[i - 1]

对于 j 来说：nums[j] = prefixSum[j] - prefixSum[j - 1]
那要 i 项到 j 项的累加和
nums[i] + nums[i + 1] + ... + nums[j - 1] + nums[j]  
= (prefixSum[i] - prefixSum[i - 1]) + (prefixSum[i + 1] - prefixSum[i]) + ... + (prefixSum[j] - prefixSum[j - 1])

根据小学加减法合并同类项，最后我们可以得到这个
nums[i] + ... + nums[j] = prefixSum[j] - prefixSum[i - 1]

如果想要第 i 项到第 j 项的累加和为题目给定值 k，那就是需要满足这个条件
k = prefixSum[j] - prefixSum[i - 1]
移项可得：prefixSum[j] - k = prefixSum[i - 1]

在 ES6 中，可以使用 Map 来记录前缀和，在 ES5 可以使用对象{}记录。Map 本质上是键值对的集合（Hash 结构）。

- 先留意边界情况，就是 i 为 0 的时候，prefixSum[-1]设置成（0, 1)，即预设已经出现 1 次为 0 的前缀和
- 设置 preSum 为累计和变量，每一次循环检查 map 中是否已经存入了，如果没有存入，则存入 set(presum, 1) 设置次数为 1，表示出现了 1 次。如果已经存在了，则将次数+1

- 同时检查 map 是否存在这个项 prefixSum[i - 1]，能够让这个 prefixSum[j] - k = prefixSum[i - 1] 成立。其实也可以理解成
  prefixSum[j] 当前前缀和  
  prefixSum[i - 1] 以前求出来的前缀和  
  k 一个值  
  假设 map 中存在一个之前存下来的 key 是（prefixSum[j] - k），那么就可以说：k = prefixSum[j] - prefixSum[i - 1]这个成立了，这个时候 counter 就需要记录了，+ 1 吗？不是的，key 也有可能出现多次，所以需要加上这个 key 的对应的次数值，才正确。

比较坑的是：

- 题目说这个数组长度不确定，而且元素不一定是正数，也可能出现负数
- 要求只记录次数，如果是记录数组元素可能又是另一种解法了
- 需要注意边界情况，比如数组长度为 0，解题过程中的 i - 1 的情况

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
  if (nums.length === 0) return 0;

  let len = nums.length;
  let map = new Map();
  map.set(0, 1);

  let counter = 0;
  let preSum = 0;

  for (let i = 0; i < len; i++) {
    preSum += nums[i];

    if (map.get(preSum - k)) {
      counter += map.get(preSum - k);
    }

    if (map.get(preSum)) {
      map.set(preSum, map.get(preSum) + 1);
    } else {
      map.set(preSum, 1);
    }
  }
  return counter;
};
```
