<template>
  <div>
    <label>Group by:</label>
    <select v-model="groupBy">
      <option value="category">Category</option>
      <option value="currency">Currency</option>
      <option value="account">Account</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const groupBy = defineModel({
    required: true
})
</script>