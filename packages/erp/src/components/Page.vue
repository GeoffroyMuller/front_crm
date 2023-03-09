<template>
  <div class="page-menu">
    <div class="typo-title">
      {{ title }}
    </div>
    <div class="buttons">
      <Media up="md">
        <ActionMenu
          :actions="[
            { icon: 'door_open', action: disconnect, title: 'disconnect' },
          ]"
        >
          <Button variant="text" class="auth">
            {{ auth.firstname }} {{ auth.lastname }}
          </Button>
        </ActionMenu>
      </Media>
    </div>
  </div>
  <div class="page-btn-back" v-if="back">
    <Button @click="goToBack" variant="text" icon="chevron_left">{{
      $t("back")
    }}</Button>
  </div>
  <Spinner v-if="loading" class="page-spinner" />
  <div v-else class="page-content" :class="$props.class">
    <slot />
  </div>
</template>

<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import useUserStore from "@/stores/user";
import { computed } from "vue";
import Spinner from "core/src/components/Spinner.vue";
import Media from "core/src/components/Media.vue";
import ActionMenu from "core/src/components/ActionMenu.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useUI from "core/src/composables/ui";

interface PageProps {
  title: string;
  loading?: boolean;
  class?: any;
  back?: boolean;
}

const props = withDefaults(defineProps<PageProps>(), {});

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

const { confirm } = useUI();

const auth = computed(() => {
  return userStore.getAuth;
});
const goToBack = () => {
  history.back();
};

async function disconnect() {
  if (await confirm(t("sure-disconnect"))) {
    userStore.disconnect();
    router.replace("/login");
  }
}
</script>

<style lang="scss">
.page-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-100%, -100%);
}
.page-content {
  padding: 0 spacing(2);
  padding-bottom: spacing(2);
  margin-top: spacing(2);
  display: grid;
  gap: spacing(1);
}
.page-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: spacing(3.5) spacing(2);
  background-color: color("primary", 400);
  background: linear-gradient(
    95deg,
    darken(color("primary", 400), 1%) 0%,
    color("primary", 400) 100%
  );

  .typo-title {
    color: white;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: spacing(1.5);
    .auth {
      font-weight: 600;
      color: white;
      margin-right: spacing(0.25);
      &:hover {
        text-shadow: unset;
        color: color("primary", 100);
      }
    }
  }
}
@include media-down(md) {
  .page-menu {
    background-color: unset;
    background: unset;
    .typo-title {
      color: unset;
    }
  }
}
.page-btn-back {
  padding: 0 spacing(2);
  margin-top: spacing(2);
}
</style>
