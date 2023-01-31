<template>
  <div class="page-menu">
    <div class="title">
      {{ title }}
    </div>
    <div class="buttons">
      <Media up="md">
        <Menu>
          <template #activator>
            <Button variant="text" class="auth">
              {{ auth.firstname }} {{ auth.lastname }}
            </Button>
          </template>
          <template #content>
            <AccountActions />
          </template>
        </Menu>
      </Media>
    </div>
  </div>
  <Spinner v-if="loading" class="page-spinner" />
  <div v-else class="page-content" :class="$props.class">
    <slot />
  </div>
</template>

<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import IconButton from "@/core/components/IconButton.vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import useUI from "@/core/helpers/vue/composables/ui";
import { computed } from "vue";
import Spinner from "@/core/components/Spinner.vue";
import Menu from "@/core/components/Menu.vue";
import AccountActions from "./AccountActions.vue";
import Media from "@/core/Media.vue";

interface PageProps {
  title: string;
  loading?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<PageProps>(), {});

const userStore = useUserStore();

const auth = computed(() => {
  return userStore.getAuth;
});
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
}
.page-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 spacing(2);
  height: spacing(10);
  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: spacing(1.5);
    .auth {
      font-weight: 600;
      color: color("primary", 500);
      margin-right: spacing(0.25);
    }
  }
}
</style>
