<template>
  <div id="container">
    <div class="nav">
      <div class="logo-container">
        <!-- <img
        src="@/assets/img/logo.png"
        alt="logo"
        :style="{ height: '50px', width: '50px' }"
      /> -->
        <span> CRM </span>
      </div>
      <div class="nav-items">
        <div
          v-for="item of menu"
          :key="item.title"
          @click="$router.push(item.path)"
          class="nav-item"
        >
          <Icon :name="item.icon" color="black" />
          {{ item.title }}
        </div>
      </div>

      <div class="footer">
        <Button
          variant="text"
          color="primary"
          @click="modalDisconnectOpen = true"
        >
          Disconnect
        </Button>
        <Modal v-model:open="modalDisconnectOpen">
          <div>Are you sure your want to disconnect ?</div>

          <div class="actions">
            <Button
              variant="text"
              color="primary"
              @click="modalDisconnectOpen = false"
            >
              Cancel
            </Button>
            <Button variant="text" color="primary" @click="disconnect">
              Disconnect
            </Button>
          </div>
        </Modal>
      </div>
    </div>
    <div class="menu">
      <div class="title">
        {{ title }}
      </div>
      <div class="buttons">
        <Button variant="text" class="auth">
          {{ auth.firstname }} {{ auth.lastname }}
        </Button>
        <Button variant="text">
          <Icon name="bell" />
        </Button>
      </div>
    </div>
    <div class="page-container">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide } from "vue";
import Icon from "@/core/components/Icon.vue";
import Button from "@/core/components/Button.vue";
import { useUserStore } from "@/features/stores/user";
import { useRouter } from "vue-router";
import Modal from "@/core/components/Modal.vue";

const title = ref("");

const modalDisconnectOpen = ref(false);

const userStore = useUserStore();

const auth = computed(() => {
  return userStore.getAuth;
});

const router = useRouter();

const menu = ref([
  { path: "/", title: "Home", icon: "home" },
  { path: "/customers", title: "Clients", icon: "user" },
  { path: "/", title: "Equipments", icon: "weight" },
]);

function disconnect() {
  userStore.disconnect();
  router.replace("/login");
}

provide("layout-page", {
  setTitle: (t: string) => {
    title.value = t;
  },
  getTitle: () => title.value,
});
</script>

<style lang="scss" scoped>
$navWidth: 240px;

#container {
  display: flex;
  flex-wrap: wrap;
}
.page-container {
  position: absolute;
  top: spacing(10);
  left: $navWidth;
  width: calc(100% - $navWidth);
  padding: spacing(1) spacing(2);
}
.actions {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-top: spacing(2);
}
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  padding-left: spacing(4);
  padding-right: spacing(4);
  height: spacing(10);
  margin-left: $navWidth;

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
  .footer {
    position: absolute;
    padding: spacing(0.5) spacing(3);
    bottom: 0;
    display: flex;
    justify-content: flex-start;
    width: 100%;
  }
  .logo-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding-left: spacing(4);
    padding-right: spacing(4);
    height: spacing(10);
    & span {
      font-weight: 600;
      color: color("primary", 700);
    }
  }
  .nav-items {
    width: 100%;
    .nav-item {
      padding: spacing(1);
      padding-left: spacing(2.5);
      padding-right: spacing(2.5);
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
