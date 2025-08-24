import { onBeforeUnmount, onMounted, ref } from "vue";

export function useExampleData<T extends Record<string, any>>() {
  const data = ref<null | T[]>(null);

  onMounted(async () => {
    try {
      const response = await fetch("http://localhost:5173/example_data.csv");
      const text = await response.text();
      data.value = csvToArray<T>(text);
    } catch (error) {
      console.error("Failed to load example data:", error);
      data.value = null;
    }
  });

  return data;
}

export function dataGroup<T extends Record<string, any>, K extends keyof T>(
  input: T[],
  key: K,
) {
  return input.reduce(
    (acc, curr) => {
      const item = { ...curr };
      const groupedValue = item[key];
      delete item[key];

      acc[groupedValue] ??= [];
      acc[groupedValue].push(item);

      return acc;
    },
    {} as Record<T[K], T[]>,
  );
}

function csvToArray<T extends Record<string, any>>(input: string) {
  const lines = input.trim().split("\n");
  const headerLine = lines.shift()!;
  const headers = headerLine.split(",");

  return lines.map((line) => {
    const values = line.split(",");

    if (values.length !== headers.length) {
      throw Error("values.length !== headers.length");
    }

    return headers.reduce(
      (acc, header, idx) => {
        const value = values[idx];
        acc[header] = value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }) as T[];
}

// TODO: TASK → implement exporting to XML
// export function toXml(input: Record<string, any>[]) {
//   return input.reduce((acc, curr) => `${acc}\n${JSON.stringify(curr)}`, "");
// }

export function toXml(input: Record<string, any>[]) {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const xmlItems = input
    .map(item => {
      const fieldsXml = Object.entries(item)
        .map(([key, val]) => `<${key}>${escapeXml(String(val))}</${key}>`)
        .join("");
      return `<item>${fieldsXml}</item>`;
    })
    .join("\n");

  return `<items>\n${xmlItems}\n</items>`;
}

export function useDebounce(callback: () => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  function debounced() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
      timer = null;
    }, delay);
  }

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });

  return debounced;
}