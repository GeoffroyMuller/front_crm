<template>
  <div>
    <Table
      @row-click="handleRowClick"
      :columns="[
        {
          title: $t('customer'),
          key: 'client',
        },
        {
          title: $t('amount'),
          key: 'amount',
          sortable: true,
        },
        {
          title: $t('date'),
          key: 'created_at',
          sortable: true,
        },
      ]"
      :items="[...(invoice.payments || []), ...paymentsAdded]"
    >
      <template #content-created_at="{ item }">
        {{ $utils.formatDate(item.created_at) }}
      </template>
      <template #content-client>
        {{ invoice.client?.firstname || "" }}
        {{ invoice.client?.lastname || "" }}
      </template>
      <template #content-amount="{ item }">
        {{ $utils.formatPrice(item.amount) }}
      </template>
    </Table>
    <Flex justify-content="end">
      <Button @click.stop="handleAdd" variant="text" color="success">
        {{ $t("add") }}
      </Button>
    </Flex>

    <Sidebar v-model:open="sidebarOpen" :title="$t('payment')" padding>
      <Form :model-value="paymentEdit" @submit="handleSubmitForm">
        <Grid :gap="1">
          <MagicAutocomplete
            disabled
            name="idClient"
            :label="$t('customers')"
            :getOptionLabel="(opt: Client) => `${opt.firstname} ${opt.lastname}`"
            :rules="$yup.string().required()"
            optionKey="id"
            :get-filters="(str: string) => ({ 
            $or: {
                $contains: { lastname: str, firstname: str },
            }, 
          })"
            :store="clientStore"
          />
          <DatePicker
            :disabled="!!paymentEdit?.id"
            name="created_at"
            :label="$t('date')"
          />

          <TextField
            :label="$t('amount')"
            name="amount"
            type="number"
            :step="0.01"
            :disabled="!!paymentEdit?.id"
          />

          <Grid :mt="2">
            <Button v-if="!paymentEdit?.id" color="success" type="submit">
              {{ $t("add") }}
            </Button>
          </Grid>
        </Grid>
      </Form>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import DatePicker from "@/core/components/form/Datepicker/DatePicker.vue";
import Form from "@/core/components/form/Form.vue";
import TextField from "@/core/components/form/TextField.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import Table from "@/core/components/Table.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useClientStore from "@/stores/clients";
import useInvoicesStore from "@/stores/invoices";
import type Client from "@/types/client";
import type Invoice from "@/types/invoice";
import type { InvoicePayment } from "@/types/invoice";
import dayjs from "dayjs";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

interface InvoicePaymentsProps {
  invoice: Invoice;
}

const props = withDefaults(defineProps<InvoicePaymentsProps>(), {});

const clientStore = useClientStore();
const invoiceStore = useInvoicesStore();
const { toast } = useUI();
const { t } = useI18n();

const sidebarOpen = ref(false);
const paymentEdit = ref<InvoicePayment | null>();

const paymentsAdded = ref<InvoicePayment[]>([]);

async function handleSubmitForm(data: InvoicePayment) {
  sidebarOpen.value = false;
  try {
    const p = await invoiceStore.addPayment(props.invoice.id, data);
    paymentsAdded.value.push(p);
    toast({
      type: "success",
      message: t("saved"),
    });
  } catch (err) {
    console.error(err);
    toast({
      type: "danger",
      message: err.response.data.message,
    });
  }
}

function handleAdd() {
  paymentEdit.value = {
    created_at: dayjs().toISOString(),
    idClient: props.invoice.idClient,
    amount: 0,
  };
  sidebarOpen.value = true;
}

function handleRowClick(item: InvoicePayment) {
  paymentEdit.value = item;
  sidebarOpen.value = true;
}
</script>
