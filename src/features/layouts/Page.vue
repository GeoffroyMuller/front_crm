<template>
  <div id="container" :class="{ 'mini-nav': isNavMini }">
    <div class="nav">
      <div class="logo-container">
        <!-- <img
        src="@/assets/img/logo.png"
        alt="logo"
        :style="{ height: '50px', width: '50px' }"
      /> -->
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

      <div class="footer" v-if="!isNavMini">
        <Button variant="text" color="black" @click="disconnect"> Disconnect </Button>
      </div>
    </div>
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
    <div class="page-container">
      <Spinner v-show="loading" class="loading" />
      <div v-show="!loading">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide } from "vue";
import Icon from "@/core/components/Icon.vue";
import Button from "@/core/components/Button.vue";
import { useUserStore } from "@/features/stores/user";
import { useRouter } from "vue-router";
import Spinner from "@/core/components/Spinner.vue";
import Menu from "@/core/components/Menu.vue";
import IconButton from "@/core/components/IconButton.vue";
import useUI from "@/core/helpers/vue/composables/ui";

const title = ref("");
const loading = ref<boolean>(false);

const userStore = useUserStore();

const isNavMini = ref(false);

const auth = computed(() => {
  return userStore.getAuth;
});

const router = useRouter();
const { confirm } = useUI();

const menu = ref([
  { path: "/", title: "Home", icon: "home" },
  { path: "/customers", title: "Clients", icon: "person" },
  { path: "/", title: "Equipments", icon: "weight" },
  { path: "/reservations", title: "Reservations", icon: "calendar_month" },
]);

async function disconnect() {
  if (await confirm("Are you sure your want to disconnect ?")) {
    userStore.disconnect();
    router.replace("/login");
  }
}

provide("layout-page", {
  setTitle: (t: string) => {
    title.value = t;
  },
  getTitle: () => title.value,
  setLoading: (l: boolean) => {
    loading.value = l;
  },
});
</script>

<style lang="scss" scoped>
$navWidth: 240px;
$miniNavWidth: 60px;
$menuHeight: spacing(10);

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
    .logo-container {
      justify-content: center;
      padding-right: 0;
      padding-left: 0;
    }
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

#container {
  display: flex;
  flex-wrap: wrap;
}
.page-container {
  position: absolute;
  transition: left 0.3s ease, width 0.3s ease;
  top: 0;
  left: $navWidth;
  width: calc(100% - $navWidth);
  padding: spacing(1) spacing(2);
  padding-top: $menuHeight;
  height: 100%;
}
.actions {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-top: spacing(2);
}
.page-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  padding-left: spacing(4);
  padding-right: spacing(4);
  height: $menuHeight;
  margin-left: $navWidth;
  transition: margin-left 0.3s ease;
  z-index: 2;

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .auth {
      font-weight: 600;
      color: color("primary", 500);
      margin-right: spacing(0.25);
    }
  }
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
    padding-left: spacing(2.5);
    padding-right: spacing(2.5);
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
      font-weight: 500;
      font-size: 14px;
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
