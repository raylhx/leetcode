/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
  if(nums.length === 0) return 0
  
  let len = nums.length
  let map = new Map()
  map.set(0, 1)

  let counter = 0
  let preSum = 0
  for(let i = 0; i < len; i++ ) {
      preSum += nums[i]

      if(map.get(preSum - k)) {
         counter += map.get(preSum - k) 
      }

      if(map.get(preSum)) {
          map.set(preSum, map.get(preSum) + 1)
      } else {
          map.set(preSum, 1)
      }
  }
  return counter

};