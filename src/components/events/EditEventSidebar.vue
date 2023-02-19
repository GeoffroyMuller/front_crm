<template>
  <Sidebar :open="open" @update:open="($event) => $emit('update:open', $event)">
    <Form
      :model-value="{ ...event, all_day_event: event?.dtend == null }"
      class="edit-event-form"
      @submit="handleSubmit"
    >
      <template #default="{ hasError, value }">
        <div class="title">
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

        <TextField name="location" :label="$t('events.location')" />
        <Select
          :get-option-label="
            (opt) => $t(`events.recurrenceopts.${opt || 'none'}`)
          "
          :label="$t('events.recurrence')"
          :options="recurrenceOptions"
          name="recurrence_freq"
        />
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
import Button from "@/core/components/Button.vue";
import DatePicker from "@/core/components/form/Datepicker/DatePicker.vue";
import Form from "@/core/components/form/Form.vue";
import Select from "@/core/components/form/Select.vue";
import Switch from "@/core/components/form/Switch.vue";
import TextField from "@/core/components/form/TextField.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import useUI from "@/core/helpers/vue/composables/ui";
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
    data.dtend = null;
  }
  delete data.all_day_event;
  data.idProduct = props.event?.idProduct;
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
      const id = (props.event as Event).id;
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
  padding: spacing(2);
  display: flex;
  flex-direction: column;
  gap: spacing(1);
  .title {
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
