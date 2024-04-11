<template>
  <div
    class="m-0 p-0 w-screen h-screen absolute top-0 left-0 grid place-items-center"
  >
    <Card padding>
      <Form class="grid gap-4 w-[440px]" @submit="login">
        <template #default="{ hasError }">
          <TextField :label="$t('email')" name="email" />
          <PasswordInput :label="$t('password')" name="password" />
          <div class="flex items-center gap-4">
            <Button :disabled="hasError" :loading="loading" type="submit">
              {{ $t("login") }}
            </Button>
            <GoogleLoginBtn :disabled="loading" />
          </div>
        </template>
      </Form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import TextField from "core/src/components/form/TextField.vue";
import Button from "core/src/components/Button.vue";
import useUserStore from "@/stores/user";
import { useRouter } from "vue-router";
import PasswordInput from "core/src/components/form/PasswordInput.vue";
import useUI from "core/src/composables/ui";
import Form from "core/src/components/form/Form.vue";
import { useI18n } from "vue-i18n";
import GoogleLoginBtn from "../components/GoogleLoginBtn.vue";
import Card from "core/src/components/card/Card.vue";

const userStore = useUserStore();

const router = useRouter();
const { toast } = useUI();
const { t } = useI18n();

const loading = ref(false);

async function login(data: { email: string; password: string }) {
  loading.value = true;
  try {
    const user = await userStore.login({
      email: data.email,
      password: data.password,
    });
    router.push({ name: "home" });
    toast({
      type: "success",
      message: t("welcome", { name: user.firstname }),
    });
    loading.value = false;
  } catch (err) {
    toast({
      type: "danger",
      message: t("bad-email-or-password"),
    });
    loading.value = false;
  }
}

async function loginWithCode(code: string) {
  loading.value = true;
  try {
    const user = await userStore.login({ code });
    window.history.replaceState({}, document.title, "/");
    router.push({ name: "home" });
    toast({
      type: "success",
      message: t("welcome", { name: user.firstname }),
    });
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("access_code");
  if (code) {
    loginWithCode(code);
  }
});
</script>
