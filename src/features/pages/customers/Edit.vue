<template>
  <Card id="edit-customer-page" title="Edit Customer Form">
    
  </Card>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCustomerStore } from "@/features/stores/customers";
import Card from "@/core/components/Card.vue";

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
