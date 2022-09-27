<template>
  <div id="customers-page">
    <div class="customers-list">
      <Card
        v-for="customer of customers"
        :key="customer.id"
        class="customer-card"
        @click="$router.push(`/customers/${customer.id}`)"
        :title="`${customer.firstname} ${customer.lastname}`"
        :subtitle="customer.email"
      >
        {{ customer }}

        <Button @click.stop="deleteById(customer.id)" color="danger"
          >SUPPRIMER</Button
        >
      </Card>
    </div>
    <Button @click="$router.push(`/customers/new`)" class="add-btn">
      Ajouter un utilisateur
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/features/stores/customers.js";
import { computed, onMounted } from "vue";
import Card from "@/core/components/Card.vue";
import Button from "@/core/components/Button.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import type { ID } from "@/features/types/utils";

const customersStore = useCustomerStore();
const ui = useUI();

onMounted(() => {
  customersStore.fetchAll();
});
const itemsInTable = [
  { firstName: "Geoffroy", lastName: "Muller", age: 22 },
  { firstName: "Etienne", lastName: "Robert", age: 24 },
];

async function deleteById(id: ID) {
  if (await ui.confirm("Voulez vous vraiment supprimer cet utilisateur ?")) {
    customersStore.delete(id);
    customersStore.fetchAll();
  }
}

const customers = computed(() => customersStore.getList);
</script>

<style lang="scss" scoped>
.customers-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: spacing(2);
  .customer-card {
    cursor: pointer;
  }
}
.add-btn {
  margin-top: spacing(2);
}
</style>
