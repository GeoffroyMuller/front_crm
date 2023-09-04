<template>
  <div
    class="page-menu"
    :class="{ 'mini-nav': layoutSideMenu?.isNavMini?.value }"
  >
    <div class="typo-title2 text-white flex items-center h-full md:hidden">
      <IconButton
        v-if="back"
        @click="goToBack"
        name="chevron_left"
        class="text-white hover:text-primary-500"
      />
      {{ title }}
    </div>
    <div class="typo-title2 max-md:hidden">
      {{ title }}
    </div>
    <div class="buttons max-md-hidden">
      <Media up="md">
        <ActionMenu
          :actions="[
            {
              icon: 'settings',
              action: () => router.push({ name: 'settings' }),
              title: 'settings',
            },
            { icon: 'door_open', action: disconnect, title: 'disconnect' },
          ]"
          placement="bottom-right"
        >
          <!-- <Button typo="title3" variant="text" class="auth">
            {{ auth.firstname }} {{ auth.lastname }}
          </Button> -->
          <Avatar color="white" class="cursor-pointer">
            {{ auth.firstname.toUpperCase()[0]
            }}{{ auth.lastname.toUpperCase()[0] }}
          </Avatar>
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

  <div v-else class="page-container">
    <PageContent :class="$props.class" :padding="padding">
      <slot />
    </PageContent>
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
import { inject } from "vue";
import type { LayoutSideMenuProvide } from "core/src/layouts/types";
import PageContent, { type PageContentProps } from "./PageContent.vue";
import Avatar from "core/src/components/Avatar.vue";
import IconButton from "core/src/components/IconButton.vue";

interface PageProps {
  title: string;
  loading?: boolean;
  class?: any;
  back?: boolean;
  padding?: PageContentProps["padding"];
}

const props = withDefaults(defineProps<PageProps>(), {
  padding: "light",
});

const layoutSideMenu = inject<LayoutSideMenuProvide>("LayoutSideMenu");

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
$header_height: $layoutSideHeaderHeight;
$navWidth: $layoutSideNavWidth;
$miniNavWidth: $layoutSideMiniNavWidth;
$headerHeightMobile: $layoutSideHeaderHeightMobile;

.page-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-100%, -100%);
}

.page-container {
  height: calc(100% - $header_height);
  overflow-y: auto;
  @include media-down(md) {
    position: absolute;
    top: $header_height;
  }
  @include media-up(md) {
    margin-top: $header_height;
  }
}

.page-content {
  &.padding-light {
    padding: spacing(2);
  }

  &.padding-large {
    $pageContentPLargeWidth: 1300px;
    padding: spacing(2);
    padding-left: max(calc((100% - $pageContentPLargeWidth) / 2), spacing(2));
    padding-right: max(calc((100% - $pageContentPLargeWidth) / 2), spacing(2));
  }

  display: flex;
  flex-direction: column;
  width: 100%;
  gap: spacing(2);
}

.page-menu {
  position: fixed;
  z-index: 21;
  top: 0;
  transition: width 0.3s ease;
  width: 100%;
  @include media_up(md) {
    width: calc(100% - $navWidth);
  }

  &.mini-nav {
    width: calc(100% - $miniNavWidth);
  }

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

  .typo-title2 {
    color: white;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: spacing(1.5);

    .auth {
      color: white;
      margin-right: spacing(0.25);

      &:hover {
        text-shadow: unset;
        color: color("primary", 100);
      }
    }
  }
}

.page-btn-back {
  padding: 0 spacing(2);
  margin-top: spacing(2);
}
</style>
