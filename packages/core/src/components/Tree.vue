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
        v-if="
          !$_.isNil(getChildrenList(item)) && itemsOpen[item.key] && !isHidden
        "
        :list="getChildrenList(item)"
        :childrenKey="childrenKey"
        :class="treeRecursiveClass ? treeRecursiveClass : 'tree-recursive'"
        :default-open="defaultOpen"
      >
        <template #item-rollable="{ data, isOpen }">
          <slot name="item-rollable" :data="data" :isOpen="isOpen"></slot>
        </template>
        <template #item="{ data }">
          <slot name="item" :data="data"></slot>
        </template>
      </Tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, ref, onMounted } from "vue";
import Tree from "./Tree.vue";

interface TreeProps {
  list: Array<{ [key: string]: any }>;
  childrenKey: string;
  isHidden: boolean;
  defaultOpen?: boolean;
  treeRecursiveClass?: any;
}

const props = withDefaults(defineProps<TreeProps>(), {
  childrenKey: "children",
  isHidden: false,
});

const itemsOpen = ref<{ [key: string]: boolean }>({});

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

onMounted(() => {
  if (props.defaultOpen) {
    props.list.forEach((item) => {
      itemsOpen.value[item.key] = true;
    });
  }
});
</script>

<style lang="scss" scoped>
.tree-recursive {
  margin-left: 1rem;
}
</style>
