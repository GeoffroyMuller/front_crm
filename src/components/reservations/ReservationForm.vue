<template>
  <Form shortcuts :model-value="reservation" @submit="handleSubmit">
    <Grid :p="2" :gap="1" :columns="1">
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

      <DatePicker name="dtstart" :label="$t('dtstart')" />
      <DatePicker name="dtend" :label="$t('dtend')" />
      <TextField multiline name="description" :label="$t('description')" />
    </Grid>
  </Form>
</template>
<script setup lang="ts">
import DatePicker from "@/core/components/form/Datepicker/DatePicker.vue";
import Form from "@/core/components/form/Form.vue";
import TextField from "@/core/components/form/TextField.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useClientStore from "@/stores/clients";
import type { Reservation } from "@/types/reservation";

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
<style lang="scss"></style>
