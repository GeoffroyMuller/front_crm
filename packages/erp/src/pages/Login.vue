<template>
  <div id="login-container">
    <Card :title="$t('connection')">
      <Form id="login-card" @submit="login">
        <template #default="{ hasError }">
          <GoogleLoginBtn :disabled="loading" />
          <span id="or-txt">- {{ $t("or") }} -</span>
          <TextField :label="$t('email')" name="email" />
          <PasswordInput :label="$t('password')" name="password" />
          <div id="login-actions">
            <Button :disabled="hasError" :loading="loading" type="submit">
              {{ $t("login") }}
            </Button>
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
import GoogleLoginBtn from "@/components/GoogleLoginBtn.vue";
import Card from "core/src/components/Card.vue";

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
  display: grid;
  gap: spacing(1);
  width: 440px;
}

@include media-down(sm) {
  #login-card {
    width: fit-content;
  }
}

#login-actions {
  display: grid;
  margin-top: spacing(1);
}

#or-txt {
  text-align: center;
  margin: spacing(2) 0;
}
</style>
