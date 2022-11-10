<template>
  <Card id="edit-customer-page" title="Edit Customer Form" v-if="isPageLoaded">
    <Button @click.stop="sidebarOpen = true">Open sidebar</Button>
    <Sidebar v-model:open="sidebarOpen">
      <CustomerForm :customerId="customer?.id" />
    </Sidebar>
  </Card>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCustomerStore } from "@/features/stores/customers";
import Card from "@/core/components/Card.vue";
import { isNil } from "lodash";
import usePage from "@/features/composables/page";
import useUI from "@/core/helpers/vue/composables/ui";
import Sidebar from "@/core/components/Sidebar.vue";
import CustomerForm from "../../components/CustomerForm.vue";
import Button from "../../../core/components/Button.vue";

const customerStore = useCustomerStore();
const route = useRoute();

const isAddAction = computed(() => !route.params.id);

const isPageLoaded = computed(
  () => isAddAction.value || !isNil(customer.value)
);
const sidebarOpen = ref(false);

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
</script>

<style lang="scss" scoped>
#edit-customer-page {
  form {
    width: 100%;
    @include flex(col, center, flex-start, 1.5);
  }
}
</style>
