<template>
  <pre>
    {{ customer }}
  </pre>
  <Card id="edit-customer-page" title="Edit Customer Form">
    <Form
      :defaultValue="customer"
      @submit="handleSubmit"
      @input-change="handleInputChange"
    >
      <TextField name="firstname" />
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

const customerStore = useCustomerStore();

const route = useRoute();

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

function handleInputChange(handleInputChangeData: any) {
  console.error({ handleInputChangeData });
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
