<template>
  <div class="mobile-layout">
    <div class="mobile-nav">
      <IconButton name="menu" @click.stop="mobileNavOpen = true" />
      <Avatar color="primary" size="sm">
        {{ user.firstname.substr(0, 1) }}{{ user.lastname.substr(0, 1) }}
      </Avatar>
      <Sidebar v-model:open="mobileNavOpen">
        <div class="mobile-nav-items-container">
          <div class="mobile-nav-items">
            <div
              v-for="item of menu"
              :key="item.title"
              @click="
                () => {
                  $router.push(item.path);
                  mobileNavOpen = false;
                }
              "
              class="mobile-nav-item"
            >
              <Icon :name="(item.icon as IconName)" color="black" />
              <div v-if="!isNavMini">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
    <slot />
  </div>
  <div class="desktop-layout" id="container" :class="{ 'mini-nav': isNavMini }">
    <div class="nav">
      <div class="logo-container">
        <span v-if="!isNavMini"> CRM </span>
        <IconButton
          @click="isNavMini = !isNavMini"
          :name="!isNavMini ? 'chevron_left' : 'menu'"
        />
      </div>
      <div class="nav-items">
        <div
          v-for="item of menu"
          :key="item.title"
          @click="$router.push(item.path)"
          class="nav-item"
        >
          <Icon :name="item.icon" color="black" />
          <div v-if="!isNavMini">{{ item.title }}</div>
        </div>
      </div>

      <div class="footer">
        <Button v-if="!isNavMini" variant="text" color="black" @click="disconnect">
          {{ $t("disconnect") }}
        </Button>

        <IconButton @click="disconnect" name="door_open" v-if="isNavMini" />
      </div>
    </div>
    <div class="page-container">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import Icon from "@/core/components/Icon.vue";
import Button from "@/core/components/Button.vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import IconButton from "@/core/components/IconButton.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import Avatar from "@/core/components/Avatar.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import type { IconName } from "@/core/components/types";

const userStore = useUserStore();

const isNavMini = ref(false);
const mobileNavOpen = ref(false);

const router = useRouter();
const { confirm } = useUI();

const menu = ref([
  { path: "/", title: "Home", icon: "home" },
  { path: "/quotes", title: "Devis", icon: "description" },
  { path: "/customers", title: "Client", icon: "person" },
]);

const user = computed(() => userStore.getAuth);

async function disconnect() {
  if (await confirm("Are you sure your want to disconnect ?")) {
    userStore.disconnect();
    router.replace("/login");
  }
}
</script>

<style lang="scss" scoped>
//mobile
@media screen and (max-width: 450px) {
  .mobile-layout {
    display: block;
  }
  .desktop-layout {
    display: none;
  }
}
//desktop
@media screen and (min-width: 450px) {
  .mobile-layout {
    display: none;
  }
  .desktop-layout {
    display: flex;
  }
}

.mobile-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: spacing(0.5) spacing(2);
}
.mobile-nav-items-container {
  display: grid;
  place-items: center;
  height: 100%;
  .mobile-nav-items {
    display: flex;
    flex-direction: column;
    gap: spacing(2.5);
    align-items: flex-start;
    justify-content: center;
    .mobile-nav-item {
      display: flex;
      align-items: flex-end;
      gap: spacing(0.5);
    }
  }
}

$navWidth: 240px;
$miniNavWidth: 60px;

.mini-nav {
  .page-menu {
    margin-left: $miniNavWidth;
  }
  .page-container {
    left: $miniNavWidth;
    width: calc(100% - $miniNavWidth);
  }
  .nav {
    width: $miniNavWidth;
  }
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  right: 50%;
  bottom: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.desktop-layout {
  flex-wrap: wrap;
}
.page-container {
  position: absolute;
  transition: left 0.3s ease, width 0.3s ease;
  top: 0;
  left: $navWidth;
  width: calc(100% - $navWidth);
  height: 100%;
}
.actions {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-top: spacing(2);
}

.nav {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  box-shadow: 2px 2px 0px 0px #f1f5f9;
  width: $navWidth;
  height: 100vh;
  position: fixed;
  transition: width 0.3s ease;

  .footer {
    position: absolute;
    padding: spacing(0.5) spacing(3);
    bottom: 0;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .logo-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    height: spacing(10);
    & span {
      font-weight: 600;
      color: color("primary", 700);
    }
  }
  .nav-items {
    width: 100%;
    .nav-item {
      $paddingX: calc(20px - spacing(1));

      padding: spacing(1);
      padding-left: $paddingX;
      padding-right: $paddingX;
      margin-left: spacing(1);
      margin-right: spacing(1);
      gap: spacing(2);
      border-radius: 6px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      @include typo(text2);
      transition: all 0.3s;
      &:hover {
        background-color: color("primary", 100);
        color: color("primary", 700);

        svg {
          fill: color("primary", 700);
        }
      }
    }
  }
}
</style>
