<template>
  <Grid :gap="1" :p="1">
    <Button variant="text" color="black" @click="disconnect">
      {{ $t("disconnect") }}
    </Button>
  </Grid>
</template>

<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

const { confirm } = useUI();

async function disconnect() {
  if (await confirm(t("sure-disconnect"))) {
    userStore.disconnect();
    router.replace("/login");
  }
}
</script>
