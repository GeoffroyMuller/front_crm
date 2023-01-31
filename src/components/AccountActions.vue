<template>
  <div class="account-actions">
    <div
      class="action"
      v-for="action in actions"
      :key="action.title"
      @click.stop="action.action()"
    >
      <Icon :name="(action.icon as IconName)"></Icon>
      {{ $t(action.title) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "@/core/components/Icon.vue";
import type { IconName } from "@/core/components/types";
import useUI from "@/core/helpers/vue/composables/ui";
import useUserStore from "@/stores/user";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

const { confirm } = useUI();

const actions = [
  { icon: "door_open", action: disconnect, title: "disconnect" },
];

async function disconnect() {
  if (await confirm(t("sure-disconnect"))) {
    userStore.disconnect();
    router.replace("/login");
  }
}
</script>

<style lang="scss">
.account-actions {
  display: grid;
  gap: spacing(0.5);
  padding: spacing(1) 0;
  .action {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: spacing(1);
    width: 100%;
    padding: spacing(0.25) spacing(1);
    min-width: max-content;
    cursor: pointer;
    &:hover {
      background-color: color("primary", 50);
    }
  }
}
</style>
