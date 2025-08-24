<template>
  <div>
    <label>xml<input type="radio" value="xml" v-model="view" /></label>
    <label>table<input type="radio" value="table" v-model="view" /> </label>
  </div>
</template>

<script setup lang="ts">
const view = defineModel({
    required: true
})
</script>