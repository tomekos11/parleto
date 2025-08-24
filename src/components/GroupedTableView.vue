<template>
  <h2>Grouped table by {{ groupBy }}</h2>
  <table>
    <thead>
      <tr class="header">
        <td v-for="header in headers" :key="header">{{ header }}</td>
      </tr>
    </thead>
    <tbody>
      <template
        v-for="([key, value], idx) in Object.entries(groupedData)"
        :key="idx"
      >
        <tr @click="emit('group-toggle', key)" class="group">
          <td>
            <div style="display: flex; justify-content: space-between">
              <span>{{ key }}</span>
            </div>
          </td>
        </tr>
        <template v-if="!hidden.has(key)">
          <tr v-for="(row, idx) in value" :key="idx">
            <td v-for="(cellValue, cellKey) in row" :key="cellKey">
              {{ cellValue }}
            </td>
          </tr>
          <tr v-if="value.length > 1">
            <td style="text-align: right">
              total: {{ totals[key] ?? "..." }} PLN
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { Data } from "../types";

defineProps<{
  groupedData: Record<string, Data[]>,
  headers: string[],
  totals: Record<string, string>,
  groupBy: keyof Data,
  hidden: Set<string>
}>();

const emit = defineEmits(["group-toggle"]);
</script>