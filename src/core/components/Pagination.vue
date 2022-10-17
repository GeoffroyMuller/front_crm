<template>
  <div class="pagination">
    <Button class="btn-arrow" @click="internalCurrentPage--">{{ "<" }}</Button>
    <TextField
      class="input-number-page"
      type="number"
      v-model="internalCurrentPage"
    />
    <Button class="btn-arrow" @click="internalCurrentPage++">{{ ">" }}</Button>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, ref, watch } from "vue";
import Button from "./Button.vue";
import TextField from "./form/TextField.vue";

interface PaginationProps {
  currentPage: number;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
});
const emit = defineEmits(["update:currentPage"]);
const internalCurrentPage = ref<number>(props.currentPage);

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
.btn-arrow {
  width: 2rem;
}
</style>
