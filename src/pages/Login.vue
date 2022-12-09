<template>
  <div id="login-container">
    <Form id="login-card" @submit="login">
      <template #default="{ hasError }">
        <TextField :label="$t('email')" name="email" />
        <PasswordInput :label="$t('password')" name="password" />
        <div id="login-actions">
          <Button :disabled="hasError" :loading="loading" type="submit">
            {{ $t("login") }}
          </Button>
        </div>
      </template>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import TextField from "@/core/components/form/TextField.vue";
import Button from "@/core/components/Button.vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import PasswordInput from "@/core/components/form/PasswordInput.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import type { AxiosError } from "axios";
import Form from "@/core/components/form/Form.vue";

const userStore = useUserStore();

const router = useRouter();
const { toast } = useUI();

const loading = ref(false);

async function login(data: { email: string; password: string }) {
  loading.value = true;
  try {
    const user = await userStore.login(data.email, data.password);
    router.push({ name: "home" });
    toast({
      type: "success",
      message: `Bienvenue ${user.firstname} !`,
    });
  } catch (err) {
    toast({
      type: "danger",
      message: err.response.data.message,
    });
  }
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
