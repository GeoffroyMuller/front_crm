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

        <Button @click.stop="deleteById(customer)" color="danger"
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
import type Customer from "@/features/types/customer";

const customersStore = useCustomerStore();
const ui = useUI();

onMounted(() => {
  customersStore.fetchAll();
});

async function deleteById(customer: Customer) {
  if (await ui.confirm("Voulez vous vraiment supprimer cet utilisateur ?")) {
    customersStore.delete(customer.id);
    ui.toast({
      type: "success",
      message: `Utilisateur ${customer.firstname}${
        customer.lastname ? " " + customer.lastname : ""
      } supprimé`,
    });
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
