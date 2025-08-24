<template>
  <h2>XML</h2>
  <pre>{{ xml }}</pre>
</template>

<script setup lang="ts">
defineProps<{ xml: string }>();
</script>