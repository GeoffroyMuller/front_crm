<template>
  <div id="login-container">
    <div id="login-card">
      <TextField label="Email" v-model="formData.email" />
      <PasswordInput label="Password" v-model="formData.password" />
      <div id="login-actions">
        <Button @click="login" :loading="loading"> Login </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import TextField from "@/core/components/form/TextField.vue";
import Button from "@/core/components/Button.vue";
import { useUserStore } from "@/features/stores/user";
import { useRouter } from "vue-router";
import PasswordInput from "@/core/components/form/PasswordInput.vue";

const userStore = useUserStore();

const router = useRouter();

const formData = reactive({
  email: "",
  password: "",
});

const loading = ref(false);

async function login() {
  loading.value = true;
  await userStore.login(formData.email, formData.password);
  router.push({ name: "home" });
  loading.value = false;
}
</script>

<style lang="scss" scoped>
#login-container {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
}

#login-card {
  background-color: white;
  padding: 16px 24px;
  min-width: 350px;
  width: fit-content;
  display: grid;
  gap: spacing(1.5);
  border-radius: map-deep-get($rounded, "md");
  box-shadow: 10px 10px 5px 0px #f1f5f9;
}

#login-actions {
}
</style>
