<template>
  <div class="reservation-form">
    <div class="title">
      {{ $t("pages.edit-reservation.new-reservation") }}
    </div>
    <Form shortcuts :model-value="reservation" @submit="handleSubmit">
      <template #default="{ hasError, hasChanged }">
        <Grid :pb="14" :gap="1" :columns="1">
          <MagicAutocomplete
            name="client"
            :label="$t('customer')"
            :getOptionLabel="
              (opt) =>
                `${opt.firstname} ${opt.lastname} ${
                  opt.email ? '|' + opt.email : ''
                } ${opt.phone ? '|' + opt.phone : ''}`
            "
            :getOptionValue="(val) => val"
            optionKey="id"
            :get-filters="
              (str) => ({
                $or: {
                  $contains: {
                    firstname: str,
                    lastname: str,
                    email: str,
                    phone: str,
                  },
                },
              })
            "
            :store="clientStore"
          />
          <Grid :gap="2" :columns="2">
            <TextField name="client.firstname" :label="$t('firstname')" />
            <TextField name="client.lastname" :label="$t('lastname')" />
          </Grid>
          <TextField name="client.address" :label="$t('address')" />
          <TextField name="client.phone" :label="$t('phone')" />
          <TextField name="client.email" :label="$t('email')" />

          <Grid :gap="2" :columns="2">
            <DatePicker name="dtstart" :label="$t('dtstart')" />
            <DatePicker name="dtend" :label="$t('dtend')" />
          </Grid>
          <TextField multiline name="description" :label="$t('description')" />
          <Repetable
            name="lines"
            :label="$t('pages.edit-reservation.add-products')"
          >
            <template #default="{ data }">
              <ReservationProductLine :line="(data as SaleLine)" />
            </template>
            <template #actions="{ addSection }">
              <Button type="button" variant="text" @click="addSection()">
                {{ $t("pages.edit-reservation.add-product") }}
              </Button>
            </template>
          </Repetable>
          <div class="actions">
            <Button :disabled="hasError || !hasChanged" type="submit">
              {{ $t("save") }}
            </Button>
          </div>
        </Grid>
      </template>
    </Form>
  </div>
</template>
<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import DatePicker from "@/core/components/form/Datepicker/DatePicker.vue";
import Form from "@/core/components/form/Form.vue";
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import TextField from "@/core/components/form/TextField.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useClientStore from "@/stores/clients";
import type { Reservation } from "@/types/reservation";
import type { SaleLine } from "@/types/sale";
import ReservationProductLine from "./ReservationProductLine.vue";

interface ReservationFormProps {
  reservation: Reservation | null;
}

const clientStore = useClientStore();
const emit = defineEmits(["saved"]);
const props = withDefaults(defineProps<ReservationFormProps>(), {
  reservation: null,
});

function handleSubmit(data: any) {
  console.error({ data }); //TODO
}
</script>
<style lang="scss">
.reservation-form {
  padding: spacing(2);
  .title {
    margin-bottom: spacing(2);
  }
}
.actions {
  padding-top: spacing(2);
  display: flex;
  justify-content: flex-end;
}
</style>
