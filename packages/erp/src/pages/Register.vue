<template>
  <div
    class="m-0 p-0 w-screen h-screen absolute top-0 left-0 grid place-items-center"
  >
    <Card padding>
      <Form class="grid gap-2 w-[440px]" @submit="login">
        <template #default="{ hasError }">
          <TextField
            :label="$t('lastname')"
            name="lastname"
            :rules="$yup.string().required()"
          />
          <TextField
            :label="$t('firstname')"
            name="firstname"
            :rules="$yup.string().required()"
          />
          <RadioGroup
            :label="$t('core.gender')"
            name="gender"
            :options="[
              { label: $t('core.men'), value: 'men' },
              { label: $t('core.women'), value: 'women' },
            ]"
            :rules="$yup.string().required()"
          />
          <TextField
            :label="$t('address')"
            name="address"
            :rules="$yup.string().required()"
          />
          <TextField
            :label="$t('core.city')"
            name="city"
            :rules="$yup.string().required()"
          />
          <TextField
            :label="$t('core.zip_code')"
            name="zip_code"
            type="number"
            :min="0"
            appearance-none
          />
          <TextField
            :label="$t('email')"
            name="email"
            :rules="$yup.string().required()"
          />
          <PasswordInput
            :label="$t('password')"
            name="password"
            :rules="$yup.string().required()"
          />
          <div class="grid gap-2">
            <Button :disabled="hasError" :loading="loading" type="submit">
              {{ $t("register") }}
            </Button>
          </div>
        </template>
      </Form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TextField from "core/src/components/form/TextField.vue";
import Button from "core/src/components/Button.vue";
import useUserStore from "@/stores/user";
import { useRouter } from "vue-router";
import PasswordInput from "core/src/components/form/PasswordInput.vue";
import useUI from "core/src/composables/ui";
import Form from "core/src/components/form/Form.vue";
import { useI18n } from "vue-i18n";
import Card from "core/src/components/card/Card.vue";
import RadioGroup from "core/src/components/form/RadioGroup.vue";

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
</script>
