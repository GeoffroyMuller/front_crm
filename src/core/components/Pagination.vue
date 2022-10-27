<template>
  <div class="pagination">
    <div class="pagination-number-page">
      <TextField
        class="input-number-page"
        type="number"
        :appearance-none="true"
        :min="min"
        :max="max"
        v-model="internalCurrentPage"
        @input="(e) => onInput(e)"
        @blur="onBlur"
      />
      <span v-if="!isNil(max)">/ {{ max }}</span>
    </div>

    <IconButton name="chevron_left" @click.stop="substractOne()" />
    <IconButton name="chevron_right" @click.stop="addOne()" />
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, ref, watch } from "vue";
import Button from "./Button.vue";
import { isNil } from "lodash";
import TextField from "./form/TextField.vue";
import IconButton from "./IconButton.vue";

interface PaginationProps {
  currentPage: number;
  min?: number | undefined | null;
  max?: number | undefined | null;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  min: 1,
  max: 10,
});
const emit = defineEmits(["update:currentPage"]);
const internalCurrentPage = ref<number | null>(props.currentPage);

const substractOne = () => {
  if (isNil(props.min) || internalCurrentPage.value! - 1 >= props.min) {
    internalCurrentPage.value!--;
  }
};
const addOne = () => {
  if (isNil(props.max) || internalCurrentPage.value! + 1 <= props.max) {
    internalCurrentPage.value!++;
  }
};
const onBlur = () => {
  if (isNil(internalCurrentPage.value)) {
    internalCurrentPage.value = props.min as number;
  }
};
const onInput = (e: any) => {
  const val = e.target.value;
  if (val === "") {
    internalCurrentPage.value = null;
  } else {
    if (val < props.min!) {
      internalCurrentPage.value = props.min as number;
    }
    if (val > props.max!) {
      internalCurrentPage.value = props.max as number;
    }
  }
};

watch(
  () => internalCurrentPage.value,
  (val) => {
    if (isNil(val)) {
      emit("update:currentPage", props.min);
    } else {
      emit("update:currentPage", val);
    }
  }
);
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 160px;
}
.pagination-number-page {
  display: flex;
  align-items: center;
  gap: 8px;
}
.input-number-page {
  width: 3rem;
}
.input-number-page:deep(.input-class) {
  text-align: center;
}
.btn-arrow {
  width: 2rem;
}
</style>
