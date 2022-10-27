<template>
  <div class="pagination">
    <Button class="btn-arrow" @click="substractOne">{{ "<" }}</Button>
    <TextField
      class="input-number-page"
      type="number"
      :appearance-none="true"
      :min="min"
      :max="max"
      v-model="internalCurrentPage"
    />
    <Button class="btn-arrow" @click="addOne">{{ ">" }}</Button>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, ref, watch } from "vue";
import Button from "./Button.vue";
import { isNil } from "lodash";
import TextField from "./form/TextField.vue";

interface PaginationProps {
  currentPage: number;
  min?: number | undefined | null;
  max?: number | undefined | null;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  min: 1,
  max: null,
});
const emit = defineEmits(["update:currentPage"]);
const internalCurrentPage = ref<number>(props.currentPage);

const substractOne = () => {
  if (isNil(props.min) || internalCurrentPage.value - 1 > props.min) {
    internalCurrentPage.value--;
  }
};
const addOne = () => {
  if (isNil(props.max) || internalCurrentPage.value + 1 < props.max) {
    internalCurrentPage.value++;
  }
};

watch(
  () => internalCurrentPage.value,
  (val) => {
    emit("update:currentPage", val);
  }
);
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  width: 140px;
}
.input-number-page {
  width: 4rem;
}
.input-number-page:deep(.input-class) {
  text-align: center;
}
.btn-arrow {
  width: 2rem;
}
</style>
