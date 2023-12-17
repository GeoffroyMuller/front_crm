<template>
  <FileInput
    v-bind="$props"
    :path="path"
    :headers="{ Authorization: getJWT() }"
    @complete="($file: any) => onComplete($file)"
    :model-value="id"
  />
</template>
<script setup lang="ts">
import config from "@/const";
import FileInput, {
  type InputFileProps,
} from "core/src/components/form/files/FileInput.vue";
import { getJWT } from "core/src/helpers/utils";
import { ref } from "vue";

const props = withDefaults(defineProps<InputFileProps>(), {});

const id = ref();

function onComplete(file: any) {
  try {
    const data = JSON.parse(file.xhr.response);
    id.value = data?.id;
  } catch (e) {
    console.error(e);
  }
}

const path = `${config.API_URL}/media/upload`;
</script>
