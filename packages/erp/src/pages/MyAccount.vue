<template>
  <Page
    imageSrc="https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/03/web-images.jpg?auto=format&q=60&w=1600&h=824&fit=crop&crop=faces"
    :title="`${auth.firstname || ''} ${auth.lastname || ''}`"
  >
  </Page>
</template>

<script setup lang="ts">
import useUserStore from "@/stores/user";
import Page from "core/src/components/Page.vue";
import { computed } from "vue";

const userStore = useUserStore();

const auth = computed(() => {
  return userStore.getAuth;
});

const pageProps = computed(() => {
  // HERE RETURN ICON IF USER HAS NO PROFILE IMAGE, IMAGE OTHERWISE
  return {};
});
</script>
