<template>
  <Card id="edit-customer-page" title="Edit Customer Form" v-if="isPageLoaded">
    <Form :defaultValue="customer" @submit="handleSubmit">
      <template v-slot:default="{ hasError }">
        <TextField
          name="firstname"
          label="Prenom"
          :rules="[$rules.required()]"
        />
        <TextField name="lastname" label="Nom" :rules="[$rules.required()]" />
        <TextField name="email" label="Email" :rules="[$rules.required()]" />

        <Button
          v-if="isAddAction"
          type="submit"
          :loading="loading"
          :disabled="loading || hasError"
        >
          Ajouter
        </Button>
        <Button
          v-else
          type="submit"
          :loading="loading"
          :disabled="loading || hasError"
        >
          Modifier
        </Button>
      </template>
    </Form>
  </Card>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCustomerStore } from "@/features/stores/customers";
import Card from "@/core/components/Card.vue";
import TextField from "@/core/components/form/TextField.vue";
import Form from "@/core/components/form/Form.vue";
import { isNil } from "lodash";
import Button from "../../../core/components/Button.vue";
import usePage from "@/features/composables/page";
import { useRouter } from "vue-router";
import useUI from "@/core/helpers/vue/composables/ui";

const customerStore = useCustomerStore();

const router = useRouter();
const route = useRoute();

const isAddAction = computed(() => !route.params.id);

const isPageLoaded = computed(
  () => isAddAction.value || !isNil(customer.value)
);

const loading = ref(false);

const customer = computed(() => {
  if (isAddAction.value) {
    return null;
  }
  return customerStore.getById(route.params.id as string);
});

const { setLoading: setPageLoading } = usePage(
  computed(() => {
    if (!isAddAction.value) {
      return !isNil(customer.value?.id)
        ? `${customer.value.firstname}${
            customer.value.lastname ? " " + customer.value.lastname : ""
          }`
        : "";
    } else {
      return "New user";
    }
  })
);

const { toast, confirm } = useUI();

onMounted(async () => {
  if (!isAddAction.value && isNil(customer.value?.id)) {
    setPageLoading(true);
  }
  await customerStore.fetchById(route.params.id);
  setPageLoading(false);
});

async function handleSubmit(data: any) {
  loading.value = true;
  if (isAddAction.value) {
    await customerStore.create(data);
    toast({
      type: "success",
      message: `Utilisateur créé avec succes`,
    });
  } else {
    await customerStore.update(route.params.id, data);
    toast({
      type: "success",
      message: `Utilisateur <b>${customer.value.firstname}${
        customer.value.lastname ? " " + customer.value.lastname : ""
      }</b> modifié avec succes`,
    });
  }
  loading.value = false;
  router.push("/customers");
}
</script>

<style lang="scss" scoped>
#edit-customer-page {
  form {
    width: 100%;
    @include flex(col, center, flex-start, 1.5);

    *:not(button) {
      width: 100%;
    }
  }
}
</style>
