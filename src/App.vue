<template>
  <ViewSelector v-model="view" />

  <GroupBySelector v-if="view === 'table'" v-model="groupBy" style="margin-bottom: 1rem;" />

  <XmlView v-if="view === 'xml'" :xml="xml" />

  <GroupedTableView
    v-else
    :groupedData="groupedData"
    :headers="headers"
    :totals="totals"
    :groupBy="groupBy"
    v-model:hidden="hidden"
    @group-toggle="groupToggle"
  />

  <EditableTable v-model="data" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onUpdated, reactive, ref, watch } from "vue";
import { dataGroup, toXml, useExampleData } from "./utils";
import type { Data } from "./types";

const EditableTable = defineAsyncComponent(() => import("./components/EditableTable.vue"));
const ViewSelector = defineAsyncComponent(() => import("./components/ViewSelector.vue"));
const GroupBySelector = defineAsyncComponent(() => import("./components/GroupBySelector.vue"));
const XmlView = defineAsyncComponent(() => import("./components/XmlView.vue"));
const GroupedTableView = defineAsyncComponent(() => import("./components/GroupedTableView.vue"));

const view = ref<"xml" | "table">("table");

const data = useExampleData<Data>();

// TODO: TASK → avoid recomputing while user is still typing
const xml = computed(() => toXml(data.value ?? []));

const groupBy = ref<keyof Data>("category");

// TODO: TASK → let the user also group by currency and account
const groupedData = computed<Record<string, Data[]>>(() => {
  if (!data.value) return {};
  return dataGroup(data.value, groupBy.value) as Record<string, Data[]>;
});

const headers = computed(() =>
  Object.keys(data.value?.[0] ?? {}).filter((i) => i !== groupBy.value),
);

const hidden = reactive(new Set<string>());

function groupToggle(groupKey: string) {
  hidden.has(groupKey) //
    ? hidden.delete(groupKey)
    : hidden.add(groupKey);
}

const currencyRatesCache: Record<string, number> = {};

// TODO: TASK → handle different currencies. Use `plnToCurrency` function to get the rates
async function totalGet(items: { amount: string | number; currency: string }[], groupKey?: string | number) {
   let totalPln = 0;

  for (const item of items) {
    const cur = (item.currency ?? groupKey).toLowerCase();

    if (!(cur in currencyRatesCache)) {
      currencyRatesCache[cur] = await plnToCurrency(cur);
    }

    const rate = currencyRatesCache[cur];

    totalPln += Number(item.amount) / rate;
  }

  return totalPln.toFixed(2);
}

async function plnToCurrency(curr: string) {
  if (curr === "pln") return 1;

  const res = await fetch(
    `http://localhost:5173/currency/pln-to-${curr.toLowerCase()}`,
  );
  const text = await res.text();
  return Number(text.trim());
}

const totals = ref<Record<string, string>>({});

watch(
  groupedData,
  async (groups) => {
    const newTotals: Record<string, string> = {};
    for (const [key, items] of Object.entries(groups)) {
      newTotals[key] = await totalGet(items, key);
    }
    totals.value = newTotals;
  },
  { immediate: true, deep: true }
);

onUpdated(() => {
  console.log('updated')
})
</script>

<style scoped>
pre {
  text-align: left;
}
</style>
