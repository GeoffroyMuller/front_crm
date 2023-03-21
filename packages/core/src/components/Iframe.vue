<template>
  <iframe ref="iframeRef" @load="resizeIframeWithContentSize" />
</template>

<script setup lang="ts">
import axios, { type AxiosRequestConfig } from "axios";
import { ref, watch } from "vue";

interface IframeProps {
  src?: string;
  config?: AxiosRequestConfig;
}

const props = withDefaults(defineProps<IframeProps>(), {});

const iframeRef = ref<HTMLIFrameElement>();

function resizeIframeWithContentSize() {
  if (!iframeRef.value) return;
  const iframe = iframeRef.value;
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;
  const iframeBody = iframeDoc.body;
  const iframeHtml = iframeDoc.documentElement;
  const height = Math.max(
    iframeBody.scrollHeight,
    iframeBody.offsetHeight,
    iframeHtml.clientHeight,
    iframeHtml.scrollHeight,
    iframeHtml.offsetHeight
  );
  iframe.style.height = height + 1 + "px";
}

async function fetchIframe() {
  if (!props.src || !iframeRef.value) return;
  const config = props.config || {};
  config.responseType = "blob";
  const res = await axios.get(props.src, config);
  iframeRef.value.src = URL.createObjectURL(res.data);
}

watch(
  () => props.src,
  async () => {
    fetchIframe();
  },
  { immediate: true }
);
</script>

<style lang="scss">
iframe {
  width: 100%;
  height: 100%;
}
</style>
