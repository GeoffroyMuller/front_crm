<template>
  <iframe :src="url" />
</template>

<script setup lang="ts">
import axios, { type AxiosRequestConfig } from "axios";
import { ref, watch } from "vue";

interface IframeProps {
  src?: string;
  config?: AxiosRequestConfig;
}

const props = withDefaults(defineProps<IframeProps>(), {});

const url = ref();

async function fetchIframe() {
  if (!props.src) return;
  const config = props.config || {};
  config.responseType = "blob";
  const res = await axios.get(props.src, config);
  url.value = URL.createObjectURL(res.data);
}

watch(
  () => props.src,
  () => {
    fetchIframe();
  },
  { immediate: true }
);
</script>
