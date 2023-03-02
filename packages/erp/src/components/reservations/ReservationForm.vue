<template>
  <div class="reservation-form">
    <div class="title">
      {{
        isNewReseravation
          ? $t("pages.edit-reservation.new-reservation")
          : $t("pages.edit-reservation.edit-reservation")
      }}
    </div>
    <div class="reservation-btn-back">
      <Button
        v-if="!isNewReseravation"
        @click.stop="$emit('back', initialReservation)"
        variant="text"
        icon="chevron_left"
      >
        {{ $t("back") }}
      </Button>
    </div>
    <Form
      class="reservation-form-content"
      shortcuts
      :initial-value="initialReservation"
      v-model="internalReservation"
      @submit="handleSubmit"
    >
      <template #default="{ hasError, hasChanged }">
        <Grid :pb="14" :gap="1" :columns="1">
          <Card class="reservation-form-client">
            <Grid class="text" :pb="2">
              {{
                isSelectExistingClient
                  ? $t("pages.edit-reservation.select-existing-client")
                  : $t("pages.edit-reservation.client-not-exist")
              }}
            </Grid>
            <MagicAutocomplete
              v-if="isSelectExistingClient"
              name="idClient"
              :get-option-value="(opt) => opt.id"
              :getOptionLabel="
                (opt) =>
                  `${opt.firstname ? opt.firstname : ''} ${
                    opt.lastname ? opt.lastname : ''
                  } ${opt.email ? '|' + opt.email : ''} ${
                    opt.phone ? '|' + opt.phone : ''
                  }`
              "
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
            <Grid v-if="!isSelectExistingClient" :gap="1" :columns="1">
              <Grid :gap="2" :columns="2">
                <TextField
                  name="clientresa.firstname"
                  :label="$t('firstname')"
                />
                <TextField name="clientresa.lastname" :label="$t('lastname')" />
              </Grid>
              <TextField name="clientresa.address" :label="$t('address')" />
              <TextField name="clientresa.phone" :label="$t('phone')" />
              <TextField name="clientresa.email" :label="$t('email')" />
            </Grid>
            <Flex :pt="2" :gap="1">
              {{
                isSelectExistingClient
                  ? $t("pages.edit-reservation.action-client-not-exist")
                  : $t("pages.edit-reservation.action-select-existing-client")
              }}
              <Button
                @click.stop="
                  () => (isSelectExistingClient = !isSelectExistingClient)
                "
                color="primary"
                variant="text"
              >
                {{
                  isSelectExistingClient
                    ? $t("pages.edit-reservation.client-not-exist")
                    : $t("pages.edit-reservation.select-existing-client")
                }}
              </Button>
            </Flex>
          </Card>
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
          <Flex justify-content="flex-start">
            <Button
              type="button"
              variant="text"
              @click.stop="$emit('prepare-products-real')"
            >
              {{ $t("pages.edit-reservation.prepare-the-products") }}
            </Button>
          </Flex>

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
import Button from "core/src/components/Button.vue";
import DatePicker from "core/src/components/form/Datepicker/DatePicker.vue";
import Form from "core/src/components/form/Form.vue";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import TextField from "core/src/components/form/TextField.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useClientStore from "@/stores/clients";
import type { Reservation } from "@/types/reservation";
import type { SaleLine } from "@/types/sale";
import ReservationProductLine from "./ReservationProductLine.vue";
import useReservationStore from "@/stores/reservations";
import { isNil } from "lodash";
import useUI from "core/src/composables/ui";
import { useI18n } from "vue-i18n";
import { computed, ref, watch } from "vue";
import Card from "core/src/components/Card.vue";
import Flex from "core/src/components/layouts/Flex.vue";

interface ReservationFormProps {
  initialReservation: Reservation | null;
  reservation: Reservation | null;
}

const { t } = useI18n();
const { toast } = useUI();
const clientStore = useClientStore();
const reservationStore = useReservationStore();
const emit = defineEmits([
  "saved",
  "update:reservation",
  "prepare-products-real",
]);
const props = withDefaults(defineProps<ReservationFormProps>(), {
  initialReservation: null,
  reservation: null,
});

const internalReservation = ref<Reservation | null>(props.reservation);

const isSelectExistingClient = ref<boolean>(true);

const isNewReseravation = computed(() => {
  return isNil(props.initialReservation);
});

watch(
  () => internalReservation.value,
  (val) => {
    if (isNil(val)) return;
    emit("update:reservation", internalReservation.value);
  }
);

function mapResa(data: any): {
  reservation: Reservation;
  client: any;
} {
  const clientresaKeys = Object.keys(data);
  const client = clientresaKeys.reduce((accumulator, elem) => {
    if (elem.includes("clientresa")) {
      if (data[elem]) {
        accumulator = {
          ...accumulator,
          [elem.replace("clientresa.", "")]: data[elem],
        };
      }
      delete data[elem];
    }
    return accumulator;
  }, {});
  if (Object.keys(client).length === 0) {
    return { reservation: data, client: null };
  } else {
    return { reservation: data, client };
  }
}
async function handleSubmit(data: any) {
  if (isNewReseravation.value) {
    try {
      const { reservation, client } = mapResa(data);
      if (!reservation.idClient && client) {
        const clientRes = await clientStore.create(client);
        await reservationStore.create({
          ...reservation,
          idClient: clientRes.id,
        });
      } else {
        await reservationStore.create(reservation);
      }

      toast({
        type: "success",
        message: t("saved"),
      });
    } catch (error: any) {
      toast({
        type: "danger",
        message: error.response.data.message,
      });
    }
  } else if (props.initialReservation != null) {
    try {
      const { reservation, client } = mapResa(data);
      if (!reservation.idClient && client) {
        const clientRes = await clientStore.create(client);
        await reservationStore.update(props.initialReservation.id, {
          ...reservation,
          idClient: clientRes.id,
        });
      } else {
        await reservationStore.update(props.initialReservation.id, reservation);
      }

      toast({
        type: "success",
        message: t("saved"),
      });
    } catch (error: any) {
      toast({
        type: "danger",
        message: error.response.data.message,
      });
    }
  }
}
</script>
<style lang="scss">
.reservation-form {
  padding: spacing(2);
  .reservation-btn-back {
    padding: 0;
  }
  .title {
    margin-bottom: spacing(1) !important;
  }
  .reservation-form-content {
    margin-top: spacing(2);
    .reservation-form-client {
      margin-bottom: spacing(1);
    }
  }
}
.actions {
  padding-top: spacing(2);
  display: flex;
  justify-content: flex-end;
}
</style>
