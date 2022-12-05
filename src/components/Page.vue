<template>
  <div class="page-menu">
    <div class="title">
      {{ title }}
    </div>
    <div class="buttons">
      <Button variant="text" class="auth">
        {{ auth.firstname }} {{ auth.lastname }}
      </Button>
      <Menu>
        <template #activator>
          <IconButton name="notifications" />
        </template>
        <template #default> dqsjbsqdnsqdbhs </template>
      </Menu>
    </div>
  </div>
  <Spinner v-if="loading" class="loading" />
  <slot v-else />
</template>

<script setup lang="ts">
import Menu from "@/core/components/Menu.vue";
import Button from "@/core/components/Button.vue";
import IconButton from "@/core/components/IconButton.vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import useUI from "@/core/helpers/vue/composables/ui";
import { computed } from "vue";
import Spinner from "@/core/components/Spinner.vue";

interface PageProps {
  title: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<PageProps>(), {});

const userStore = useUserStore();

const auth = computed(() => {
  return userStore.getAuth;
});
</script>

<style lang="scss">
.page-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  padding: spacing(3) 0;
  transition: margin-left 0.3s ease;
  z-index: 2;
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
