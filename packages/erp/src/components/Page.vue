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
  <!--   <div class="page-btn-back" v-if="back">
    <Button @click="goToBack" variant="text" icon="chevron_left">{{
      $t("back")
    }}</Button>
  </div> -->
  <Spinner v-if="loading" class="page-spinner" />
  <div
    v-else
    class="page-content"
    :class="[
      $props.class,
      {
        'padding-light': padding === 'light',
        'padding-large': padding === 'large',
      },
    ]"
  >
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
  padding?: null | "light" | "large";
}

const props = withDefaults(defineProps<PageProps>(), {
  padding: "light",
});

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
$header_height: 80px;
.page-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-100%, -100%);
}
.page-content {
  height: calc(100% - $header_height);
  overflow-y: auto;
  &.padding-light {
    padding: spacing(2);
    margin-top: $header_height;
  }
  &.padding-large {
    $pageContentPLargeWidth: 1400px;
    padding: spacing(2);
    padding-left: max(calc((100% - $pageContentPLargeWidth) / 2), spacing(2));
    padding-right: max(calc((100% - $pageContentPLargeWidth) / 2), spacing(2));
    // max-width: 1200px;
    // margin: auto;
    margin-top: $header_height;
  }
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: spacing(1);
}
.page-menu {
  position: fixed;
  z-index: 25;
  top: 0;
  width: 100%;
  height: $header_height;
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
    height: auto;
    .typo-title {
      color: unset;
    }
  }
  .page-content {
    margin-top: 0;
  }
}
.page-btn-back {
  padding: 0 spacing(2);
  margin-top: spacing(2);
}
</style>
