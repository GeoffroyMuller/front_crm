<template>
  <div class="table">
    <label v-if="label?.length" class="table-label">
      {{ label }}
    </label>
    <Media down="md">
      <div v-if="$slots['head']">
        <slot name="head" />
      </div>
      <div class="table-mobile">
        <div>
          <slot name="actions-title"></slot>
        </div>
        <template v-if="items && items.length > 0">
          <Card
            padding
            v-for="item in items"
            :key="item[itemsKey]"
            @click.stop="$emit('row-click', item)"
          >
            <Flex :mb="1.5" v-if="selectable">
              <Checkbox
                :modelValue="!!isSelected(item)"
                @click.stop="toggleSelected(item)"
              ></Checkbox>
            </Flex>
            <div class="table-mobile-card">
              <div
                v-for="column in internalColumns"
                :key="column.key"
                class="table-mobile-line"
              >
                <div>
                  <div
                    v-if="!$slots.title && !$slots['title-' + (column.key as string)]"
                  >
                    {{ column.title }}
                  </div>
                  <slot
                    v-if="!$slots.title"
                    :name="`title-${column.key as string}`"
                    :column="column"
                  />
                  <slot name="title" :column="column" />
                </div>
                <div>
                  <div
                    v-if="!$slots.content && !$slots[`content-${column.key as string}`]"
                  >
                    {{
                      (column?.data ? column?.data(item) : undefined) ||
                      item[column.key]
                    }}
                  </div>
                  <slot
                    v-else-if="!$slots.content"
                    :name="`content-${column.key as string}`"
                    :column="column"
                    :item="item"
                  ></slot>
                  <slot name="content" :column="column" :item="item" />
                </div>
              </div>
              <div
                v-if="$slots['actions-title'] || $slots['actions']"
                :style="styleItem"
                class="actions-block"
              >
                <slot name="actions" :item="item"></slot>
              </div>
            </div>
          </Card>
        </template>
        <template v-else>
          <Card>
            <slot v-if="$slots.empty" name="empty"></slot>
            <div v-else class="empty-block">
              {{ $t("empty") }}
            </div>
          </Card>
        </template>
        <slot name="footer"></slot>
      </div>
    </Media>
    <Media up="md">
      <component
        :is="isCard ? Card : 'div'"
        :withPadding="false"
        class="table-container"
      >
        <div class="table-wrapper">
          <div class="table-head" v-if="$slots['head']">
            <slot name="head" />
          </div>
          <table
            :class="{
              'table-loading': loading,
            }"
          >
            <thead>
              <tr>
                <th v-if="selectable">
                  <Checkbox
                    @click.stop="selectAll"
                    :modelValue="!!allSelected"
                  ></Checkbox>
                </th>
                <th v-for="column in internalColumns" :key="column.key">
                  <div
                    v-if="!$slots.title && !$slots['title-' + (column.key as string)]"
                  >
                    {{ column.title }}
                  </div>
                  <slot
                    v-if="!$slots.title"
                    :name="`title-${column.key as string}`"
                    :column="column"
                  />
                  <slot name="title" :column="column" />
                </th>
                <th v-if="$slots['actions-title'] || $slots['actions']">
                  <div class="actions-block">
                    <slot name="actions-title"></slot>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <div>
                  <Spinner />
                </div>
              </template>
              <template v-else-if="items && items.length > 0">
                <tr
                  v-for="item in items"
                  :key="item[itemsKey]"
                  @click.stop="$emit('row-click', item)"
                >
                  <td v-if="selectable">
                    <Checkbox
                      :modelValue="!!isSelected(item)"
                      @click.stop="toggleSelected(item)"
                    ></Checkbox>
                  </td>
                  <td
                    v-for="column in columns"
                    :key="column.key"
                    :style="styleItem"
                  >
                    <div
                      v-if="!$slots.content && !$slots[`content-${column.key as string}`]"
                    >
                      {{
                        (column?.data ? column?.data(item) : undefined) ||
                        item[column.key]
                      }}
                    </div>
                    <slot
                      v-else-if="!$slots.content"
                      :name="`content-${column.key as string}`"
                      :column="column"
                      :item="item"
                    ></slot>
                    <slot name="content" :column="column" :item="item" />
                  </td>
                  <td
                    v-if="$slots['actions-title'] || $slots['actions']"
                    :style="styleItem"
                    class="actions-block"
                  >
                    <slot name="actions" :item="item"></slot>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td
                    :colspan="
                      internalColumns?.length +
                      ($slots['actions-title'] || $slots['actions'] ? 1 : 0) +
                      (selectable ? 1 : 0)
                    "
                  >
                    <slot v-if="$slots.empty" name="empty"></slot>
                    <div v-else class="empty-block">
                      {{ $t("empty") }}
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot v-if="$slots.footer">
              <tr>
                <td
                  :colspan="
                    internalColumns?.length +
                    ($slots['actions-title'] || $slots['actions'] ? 1 : 0) +
                    (selectable ? 1 : 0)
                  "
                >
                  <slot class="table-footer" name="footer"></slot>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </component>
    </Media>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, ref, watch, onMounted, computed } from "vue";
import type { Column } from "./types";
import { isEqual, isNil } from "lodash";
import Card from "./card/Card.vue";
import Spinner from "./Spinner.vue";
import Media from "./Media.vue";
import Checkbox from "./form/Checkbox.vue";
import Flex from "./layouts/Flex.vue";
import type { ID } from "../types";

export interface TableProps<T = any> {
  columns: Array<Column> | null;
  items: Array<T> | null;
  styleItem?: string;
  isCard?: boolean;
  loading?: boolean;
  selectable?: boolean;
  selected?: any[];
  label?: string;
  itemsKey?: ID;
}

const props = withDefaults(defineProps<TableProps>(), {
  columns: null,
  items: null,
  isCard: true,
  itemsKey: "id",
});

const emit = defineEmits(["row-click", "update:selected"]);

const internalColumns = ref<Array<Column> | null>(null);
const itemsIsInit = ref<boolean>(false);
const selected = ref<any[]>(props.selected || []);

watch(
  () => props.selected,
  () => {
    if (props.selected?.length) {
      selected.value = props.selected;
    }
  }
);

const isSelected = (item: any) => selected.value.find((s) => isEqual(s, item));

function toggleSelected(item: any) {
  const index = selected.value.findIndex((s) => isEqual(s, item));
  if (index === -1) {
    selected.value.push(item);
  } else {
    selected.value = selected.value.filter((s, i) => i != index);
  }
  emit("update:selected", selected.value);
}

function selectAll() {
  if (!allSelected.value) {
    for (const item of props.items || []) {
      if (!isSelected(item)) {
        selected.value.push(item);
      }
    }
  } else {
    for (const item of props.items || []) {
      if (isSelected(item)) {
        toggleSelected(item);
      }
    }
  }
  emit("update:selected", selected.value);
}

const allSelected = computed(() => {
  if (!props.items?.length) {
    return false;
  }
  return (props.items || []).reduce(
    (prev, current) => prev && isSelected(current),
    true
  );
});

const getColumnsByItems = () => {
  const columnsKey: string[] = [];
  props.items?.forEach((item) => {
    columnsKey.push(...Object.keys(item));
  });
  const columnsRes = Array.from(new Set(columnsKey)).map((colKey) => {
    return { key: colKey, title: colKey } as Column;
  });
  return columnsRes;
};

onMounted(() => {
  internalColumns.value = props.columns || getColumnsByItems();
});

watch(
  () => props.items,
  (val) => {
    if (isNil(val)) return;
    if (!itemsIsInit.value) {
      internalColumns.value = props.columns || getColumnsByItems();
    }
  },
  { immediate: false }
);
</script>

<style lang="scss" scoped>
.table {
  overflow-x: auto;
  width: 100%;
}
.table-container {
  overflow-x: auto; // TODO : pourquoi il prend la taille des menu en compte pour sa taille
}
.table-mobile {
  width: 100%;
  display: grid;
  place-items: center;
  gap: spacing(1);
  > * {
    width: 100%;
  }
  .table-mobile-card {
    display: grid;
    gap: spacing(1);
    max-width: 100%;
    overflow: hidden;
    .table-mobile-line {
      max-width: 100%;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: spacing(1);
      > *:last-child {
        display: flex;
        justify-content: flex-end;
        text-align: end;
      }
    }
  }
}
.table-loading {
  tbody {
    position: relative;
    height: 300px;
    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-100%, -100%);
    }
  }
  tbody tr td {
    height: 300px;
    div {
      display: grid;
      width: 100%;
      height: 100%;
      place-items: center;
    }
  }
}

td,
th {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0px 16px;
  height: 52px;
}
th {
  text-align: left;
  height: 60px;
}

.table-head {
  padding: 16px;
}
table {
  width: 100%;
  border-collapse: collapse;
  tbody td {
    font-weight: 400;
  }
  tbody tr {
    transition: 0.3s;
    &:hover {
      background-color: color("primary", 50);
      cursor: pointer;
    }
  }
  tfoot tr td {
    padding-right: 25px;
    border-bottom: 0;
    height: 60px;
  }
}
.table-footer {
  width: 100%;
}
.empty-block {
  @apply flex justify-center items-center;
  margin: spacing(5);
}
.actions-block {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
label.table-label {
  display: block;
  margin-bottom: spacing(1);
}
</style>
