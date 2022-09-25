<template>
  <Card id="edit-customer-page" title="Edit Customer Form">
    <form @submit="onSumbit(handleSubmit)($event)" ref="formRef">
      <TextField
        label="Firstname"
        name="firstname"
        v-model="formValues.firstname"
        v-model:error="errors.firstname"
      />
      <TextField
        label="Lastname"
        name="lastname"
        v-model="formValues.lastname"
        v-model:error="errors.lastname"
      />
      <DatePicker
        label="Birthdate"
        name="birthdate"
        v-model="formValues.birthdate"
        v-model:error="errors.birthdate"
      />

      <Button type="submit" :disabled="hasError">Submit</Button>
    </form>
  </Card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCustomerStore } from "@/features/stores/customers";
import DatePicker from "@/core/components/form/DatePicker.vue";
import useForm from "@/core/helpers/vue/composables/form";
import TextField from "@/core/components/form/TextField.vue";
import Button from "@/core/components/Button.vue";
import Card from "@/core/components/Card.vue";
import { required } from "@/core/helpers/rules";

const customerStore = useCustomerStore();

const route = useRoute();

const formRef = ref(null);

const { onSumbit, errors, hasError, formValues } = useForm({
  ref: formRef,
  rules: {
    firstname: [required()],
    lastname: [required()],
  },
});

const isAddAction = computed(() => !route.params.id);
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
  console.error({ data });
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
