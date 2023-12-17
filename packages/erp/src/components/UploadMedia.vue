<template>
  <FileInput
    v-bind="$props"
    :path="path"
    :headers="{ Authorization: getJWT() }"
    @complete="($file: any) => onComplete($file)"
    :model-value="data?.id"
    @cancel="onCancel()"
    @validate="onValidate()"
  />
</template>
<script setup lang="ts">
import config from "@/const";
import axios from "axios";
import FileInput, {
  type InputFileProps,
} from "core/src/components/form/files/FileInput.vue";
import { getJWT } from "core/src/helpers/utils";
import { ref } from "vue";

const props = withDefaults(defineProps<InputFileProps>(), {});
const emit = defineEmits(["validate"]);

const data = ref();

function onComplete(file: any) {
  try {
    data.value = JSON.parse(file.xhr.response);
  } catch (e) {
    console.error(e);
  }
}

async function onValidate() {
  await emit("validate", data.value);
}
function onCancel() {
  axios.delete(`${config.API_URL}/media/upload/${data.value.id}`, {
    headers: { Authorization: getJWT() || "" },
  });
}

const path = `${config.API_URL}/media/upload`;
</script>
