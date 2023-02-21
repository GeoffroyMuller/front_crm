<template>
  <Media down="md">
    <div class="pagination pagination-mobile">
      <div class="pagination-items-per-page">
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

        <div class="pagination-buttons">
          <IconButton name="chevron_left" @click.stop="substractOne()" />
          <IconButton name="chevron_right" @click.stop="addOne()" />
        </div>
      </div>
    </div>
  </Media>
  <Media up="md">
    <div class="pagination">
      <div class="pagination-items-per-page">
        <span>{{ $t("lines-per-page") }}</span>
        <Select
          class="items-per-page"
          :options="[
            { label: '5', value: 5 },
            { label: '10', value: 10 },
            { label: '15', value: 15 },
            { label: '20', value: 20 },
          ]"
          required
          :modelValue="itemsPerPage"
          @update:modelValue="(val) => $emit('update:itemsPerPage', val)"
        />
      </div>

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

      <div class="pagination-buttons">
        <IconButton name="chevron_left" @click.stop="substractOne()" />
        <IconButton name="chevron_right" @click.stop="addOne()" />
      </div>
    </div>
  </Media>
</template>

<script setup lang="ts">
import { withDefaults, ref, watch } from "vue";
import { isNil } from "lodash";
import TextField from "./form/TextField.vue";
import IconButton from "./IconButton.vue";
import Select from "@/core/components/form/Select.vue";
import Media from "./Media.vue";

interface PaginationProps {
  currentPage: number;
  min?: number | undefined | null;
  max?: number | undefined | null;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  min: 1,
  max: 10,
  itemsPerPage: 10,
});
const emit = defineEmits(["update:currentPage", "update:itemsPerPage"]);
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
span {
  white-space: nowrap;
}
.pagination {
  @include flex(row, end, center);
  &.pagination-mobile {
    justify-content: start;
  }
  gap: spacing(4);
}

.pagination-items-per-page {
  @include flex(row, center, center);
  & span {
    margin-right: 1rem;
  }
}
.pagination-number-page {
  display: flex;
  align-items: center;
  gap: spacing(1);
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
.pagination-buttons {
  @include flex(row, center, center);
}
.items-per-page {
  width: 4rem;
}
</style>
