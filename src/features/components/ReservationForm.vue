<template>
  <Form :defaultValue="value" @submit="handleSubmit" class="reservation-form">
    <template v-slot:default="{ hasError }">
      <div class="title">
        {{ title }}
      </div>

      <div class="reservation-form-content">
        <pre class="code" v-if="value">
          {{ value }}
        </pre>
        <MagicAutocomplete
          :store="customerStore"
          :getOptionLabel="(opt) => `${opt.firstname} ${opt.lastname}`"
          :getOptionValue="(opt) => opt.id"
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
import { useCustomerStore } from "../stores/customers";
import dayjs from "dayjs";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";

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
  return `${reservation.customer?.firstname} ${reservation.customer?.lastname} - 
  ${dayjs(reservation.date).format("DD/MM/YYYY")}`;
});

const loading = ref(false);

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
