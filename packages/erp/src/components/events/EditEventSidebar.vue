<template>
  <Sidebar
    :open="open"
    @update:open="($event) => $emit('update:open', $event)"
    padding
  >
    <Form
      :initial-value="{
        recurrence_freq: recurrenceOptions[0],
        ...event,
        all_day_event: event?.dtend == event?.dtstart,
      }"
      class="edit-event-form"
      @submit="handleSubmit"
    >
      <template #default="{ hasError, value }">
        <div class="typo-title">
          {{ isAddAction ? $t("events.new-event") : $t("events.event") }}
        </div>
        <TextField
          v-if="!hideDescription"
          name="summary"
          :label="$t('events.summary')"
        />
        <TextField
          v-if="!hideDescription"
          name="description"
          multiline
          :label="$t('events.descriptions')"
        />

        <Flex align-items="center" :gap="1">
          <DatePicker time name="dtstart" :label="$t('events.dtstart')" />
          <DatePicker
            time
            name="dtend"
            :label="$t('events.dtend')"
            :disabled="value.all_day_event"
          />
        </Flex>
        <Switch name="all_day_event" :label="$t('events.all_day_event')" />
        <Select
          :get-option-label="
            (opt) => $t(`events.recurrenceopts.${opt || 'none'}`)
          "
          :label="$t('events.recurrence')"
          :options="recurrenceOptions"
          name="recurrence_freq"
          :rules="$yup.string().nullable().defined()"
          required
        />
        <Flex v-if="value.recurrence_freq != recurrenceOptions[0]" :gap="1">
          <!-- <TextField
            name="recurrence_interval"
            :label="$t('events.recurrence_interval')"
            type="number"
            :step="1"
            :min="1"
            :model-value="1"
            :rules="$yup.string().required()"
          /> -->
          <TextField
            name="recurrence_count"
            :label="$t('events.recurrence_count')"
            type="number"
            :step="1"
          />
          <DatePicker
            name="recurrence_until"
            :label="$t('events.recurrence_until')"
          />
        </Flex>

        <div class="actions">
          <Button type="submit" color="success" icon="add" :disabled="hasError">
            {{ isAddAction ? $t("add") : $t("save") }}
          </Button>
        </div>
      </template>
    </Form>
  </Sidebar>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import DatePicker from "core/src/components/form/Datepicker/DatePicker.vue";
import Form from "core/src/components/form/Form.vue";
import Select from "core/src/components/form/Select.vue";
import Switch from "core/src/components/form/Switch.vue";
import TextField from "core/src/components/form/TextField.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Sidebar from "core/src/components/Sidebar.vue";
import useUI from "core/src/composables/ui";
import useEventsStore from "@/stores/events";
import type { Event } from "@/types/events";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

interface EditEventSidebarProps {
  open: boolean;
  event?: Event;
  hideDescription?: boolean;
}

const emit = defineEmits(["update:open", "add", "update"]);
const props = withDefaults(defineProps<EditEventSidebarProps>(), {});

const { toast } = useUI();
const { t } = useI18n();
const eventStore = useEventsStore();

const isAddAction = computed(() => props.event?.id == null);

const recurrenceOptions: Event["recurrence_freq"][] = [
  null,
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
];

// rrule documentation: https://www.kanzaki.com/docs/ical/rrule.html
async function handleSubmit(data: any) {
  if (data.all_day_event) {
    data.dtend = data.dtstart;
  }
  if (data.recurrence_freq == recurrenceOptions[0]) {
    delete data.recurrence_freq;
    delete data.recurrence_interval;
    delete data.recurrence_count;
    delete data.recurrence_until;
  } else {
    data.recurrence_interval = 1;
  }
  delete data.all_day_event;
  data.idProduct = props.event?.idProduct;
  if (!data.recurrence_until) {
    data.recurrence_until = null;
  }
  if (isAddAction.value) {
    try {
      const newEvent = await eventStore.create(data);
      emit("add", newEvent);
      toast({
        type: "success",
        message: t("saved"),
      });
      emit("update:open", false);
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
    }
  } else {
    try {
      const id = (props.event as Event).id as number;
      const e = await eventStore.update(id, data);
      emit("update", {
        data: e,
        id,
      });
      toast({
        type: "success",
        message: t("saved"),
      });
      emit("update:open", false);
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-event-form {
  display: flex;
  flex-direction: column;
  gap: spacing(1);
  .typo-title {
    margin-bottom: spacing(2);
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: spacing(2);
  }
}
</style>
