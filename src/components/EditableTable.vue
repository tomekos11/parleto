<template>
  <table>
    <tr v-for="(item, idx) in items" :key="idx">
      <td v-for="(_, key) in item" :key="key">
        <input type="text" v-model.lazy="item[key]" />
      </td>
    </tr>
  </table>
</template>

<script setup lang="ts">
const items = defineModel({
    required: true
});
</script>