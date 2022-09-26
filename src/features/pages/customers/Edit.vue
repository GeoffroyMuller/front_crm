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

        <Button v-if="isAddAction" type="submit" :disabled="hasError">
          Ajouter
        </Button>
        <Button v-else type="submit" :disabled="hasError"> Modifier </Button>
      </template>
    </Form>
  </Card>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCustomerStore } from "@/features/stores/customers";
import Card from "@/core/components/Card.vue";
import TextField from "@/core/components/form/TextField.vue";
import Form from "@/core/components/form/Form.vue";
import { isNil } from "lodash";
import Button from "../../../core/components/Button.vue";

const customerStore = useCustomerStore();

const route = useRoute();

const isAddAction = computed(() => !route.params.id);

const isPageLoaded = computed(
  () => isAddAction.value || !isNil(customer.value)
);

const customer = computed(() => {
  if (isAddAction.value) {
    return null;
  }
  return customerStore.getById(route.params.id as string);
});

onMounted(async () => {
  customerStore.fetchById(route.params.id);
});

function handleSubmit(data: any) {
  if (isAddAction.value) {
    customerStore.create(data);
  } else {
    //customerStore.update(id, data);
  }
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
