<template>
  <div id="customers-page">
    <!--     <Table
      :columns="[
        {
          title: 'Lastname',
          key: 'lastname',
        },
        {
          title: 'Firstname',
          key: 'firstname',
        },
        {
          title: 'Email',
          key: 'email',
        },
        {
          title: 'Birthdate',
          key: 'birthdate',
          data: (item: Customer) => formatDate(item.birthdate)
        },
        {
          title: '',
          key: 'action',
        },
      ]"
      styleItem="padding: 8px 16px"
      :items="customers"
      @row-click="(customer) => $router.push(`/customers/${customer.id}`)"
    >
      <template #action="{ item }">
        <Button @click.stop="deleteById(item)" color="danger" icon="delete" />
      </template>
    </Table> -->
    <DataTable
      @row-click="(customer) => $router.push(`/customers/${customer.id}`)"
      :columns="[
        {
          title: 'Lastname',
          key: 'lastname',
          sortable: true,
        },
        {
          title: 'Firstname',
          key: 'firstname',
          sortable: true,
        },
        {
          title: 'Email',
          key: 'email',
          sortable: true,
        },
        {
          title: 'Birthdate',
          key: 'birthdate',
          data: (item: Customer) => formatDate(item.birthdate)
        },
        {
          title: '',
          key: 'action',
        },
      ]"
      :items="customers"
      v-model:currentPage="currentPage"
      v-model:itemsPerPage="itemsPerPage"
      :nbPage="25"
    />
    <Button @click="$router.push(`/customers/new`)" class="add-btn" icon="add">
      Ajouter un utilisateur
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/features/stores/customers.js";
import { computed, nextTick, onMounted, ref } from "vue";
import Button from "@/core/components/Button.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import type Customer from "@/features/types/customer";
import usePage from "@/features/composables/page";
import dayjs from "dayjs";
import DataTable from "../../../core/components/DataTable.vue";

const customersStore = useCustomerStore();
const ui = useUI();

const { setLoading } = usePage("Customers");

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(5);
function formatDate(date: string) {
  return dayjs(date).format("DD/MM/YYYY");
}

onMounted(async () => {
  !customers?.value?.length && setLoading(true);
  await customersStore.fetchList();
  setLoading(false);
});

async function deleteById(customer: Customer) {
  try {
    if (await ui.confirm("Voulez vous vraiment supprimer cet utilisateur ?")) {
      await customersStore.delete(customer.id);
      nextTick(() => {
        ui.toast({
          type: "success",
          message: `Utilisateur <b>"${customer.firstname}${
            customer.lastname ? " " + customer.lastname : ""
          }"</b> supprimé`,
        });
      });
      customersStore.fetchList();
    }
  } catch (err) {
    console.error(err);
    ui.toast({
      type: "danger",
      message: `Erreur lors de la modification`,
    });
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
