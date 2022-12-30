<template>
  <div class="tree">
    <div v-for="item of list" :key="item.key">
      <div
        v-if="!$_.isNil(getChildrenList(item))"
        @click="toggleOpenByKey(item.key)"
      >
        <slot
          name="item-rollable"
          :data="item"
          :isOpen="itemsOpen[item.key]"
        ></slot>
      </div>
      <slot v-else name="item" :data="item"></slot>
      <Tree
        v-if="!$_.isNil(getChildrenList(item)) && itemsOpen[item.key]"
        :list="getChildrenList(item)"
        :childrenKey="childrenKey"
        class="tree-recursive"
      >
        <template #item-rollable="{ data }">
          <slot name="item-rollable" :data="data"></slot>
        </template>
        <template #item="{ data }">
          <slot name="item" :data="data"></slot>
        </template>
      </Tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, ref } from "vue";
import Tree from "./Tree.vue";
interface TreeProps {
  list: Array<any>;
  childrenKey: string;
}

const props = withDefaults(defineProps<TreeProps>(), {
  childrenKey: "children",
});

const itemsOpen = ref<any>({});

const toggleOpenByKey = (key: string) => {
  // eslint-disable-next-line no-prototype-builtins
  if (itemsOpen.value.hasOwnProperty(key)) {
    itemsOpen.value[key] = !itemsOpen.value[key];
  } else {
    itemsOpen.value[key] = true;
  }
};

const getChildrenList = (data: any) => {
  // eslint-disable-next-line no-prototype-builtins
  if (data.hasOwnProperty(props.childrenKey)) {
    return data[props.childrenKey];
  } else {
    return null;
  }
};
</script>

<style lang="scss" scoped>
.tree {
  width: 100%;
}
.tree-recursive {
  margin-left: 1rem;
}
</style>
