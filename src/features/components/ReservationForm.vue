<template>
  <pre class="code" v-if="value">
  {{ value }}
  </pre>
  <Form :defaultValue="value" @submit="handleSubmit" class="reservation-form">
    <template v-slot:default="{ hasError }">
      <div class="title">
        {{ title }}
      </div>

      <div class="reservation-form-content">
        <Autocomplete
          :getOptionLabel="(opt) => `${opt.firstname} ${opt.lastname}`"
          :getOptionValue="(opt) => opt.id"
          :autoFilter="false"
          @search="searchCustomer"
          :options="customers"
          name="customerId"
          :disabled="!isAddAction"
          label="Customer"
        />

        <div class="actions">
          <Button type="button" :disabled="hasError || loading" color="black">
            Annuler
          </Button>
          <Button type="submit" :loading="loading" :disabled="hasError" icon="save">
            {{ isAddAction ? "Ajouter" : "Modifier" }}
          </Button>
        </div>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Form from "@/core/components/form/Form.vue";
import Button from "@/core/components/Button.vue";
import type Reservation from "../types/reservation";
import Autocomplete from "../../core/components/form/Autocomplete.vue";
import { useCustomerStore } from "../stores/customers";

interface ReservationFormProps {
  value?: Reservation;
  date?: string;
}

const props = withDefaults(defineProps<ReservationFormProps>(), {});
const emit = defineEmits(["done"]);

const customerStore = useCustomerStore();

const isAddAction = computed(() => {
  return props.value == null;
});

const title = computed(() => {
  if (isAddAction.value) {
    return "Nouvelle reservation - " + props.date;
  }

  const reservation = props.value as Reservation;
  return `${reservation.customer?.firstname} ${reservation.customer?.lastname}`;
});

const loading = ref(false);
const customers = ref([]);

async function searchCustomer(searchStr: string) {
  const response = await customerStore.fetchAll();
  console.error({ response });
  customers.value = response;
}

function handleSubmit(data: any) {
  console.error({ data });
  emit("done");
}
</script>

<style lang="scss">
.reservation-form {
  @include grid(1, 0, 5);
  padding: spacing(2);

  .reservation-form-content {
    @include grid(1, 0, 2);
    .actions {
      display: flex;
      gap: spacing(1);
    }
  }
}
</style>
