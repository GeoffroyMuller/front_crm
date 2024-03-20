<template>
  <Sidebar
    :open="open"
    @update:open="($event) => $emit('update:open', $event)"
    padding
    @close="$emit('close')"
  >
    <SidebarHead :actions="[]">
      <template #title>
        <div class="flex gap-2">
          <span>{{
            isAddAction ? $t("events.new-event") : $t("events.event")
          }}</span>
          <IconButton
            v-if="!isAddAction && !isEdit"
            @click.stop="isEdit = true"
            color="primary"
            default-colored
            size="xs"
            name="edit"
          />
        </div>
      </template>
    </SidebarHead>
    <SidebarContent>
      <Form
        v-if="isAddAction || isEdit"
        :initial-value="{
          recurrence_freq: recurrenceOptions[0],
          ...event,
          all_day_event: event?.dtend == event?.dtstart,
        }"
        class="flex flex-col gap-2"
        @submit="handleSubmit"
      >
        <template #default="{ hasError, value }">
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
            <DatePicker
              time
              name="dtstart"
              :label="$t('events.dtstart')"
              placement="bottom"
              alignment="start"
            />
            <DatePicker
              time
              name="dtend"
              :label="$t('events.dtend')"
              :disabled="value.all_day_event"
              placement="bottom"
              alignment="end"
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

          <SidebarActions class="flex justify-end items-center">
            <Button
              type="submit"
              color="success"
              icon="add"
              :disabled="hasError"
            >
              {{ isAddAction ? $t("add") : $t("save") }}
            </Button>
          </SidebarActions>
        </template>
      </Form>
      <div v-else>
        <div class="typo-title5 font-semibold">
          <div class="grid gap-5">
            <div class="flex gap-2" v-if="event?.summary">
              <div class="text-slate-400">
                {{ $t("events.summary") }}
              </div>
              <div class="text-slate-500">
                {{ event?.summary }}
              </div>
            </div>
            <div class="grid gap-2" v-if="event?.description">
              <div class="text-slate-400">
                {{ $t("events.descriptions") }}
              </div>
              <div class="text-slate-500">
                {{ event?.description }}
              </div>
            </div>
            <div class="flex gap-2" v-if="event?.dtstart || event?.dtend">
              <div class="grid gap-2">
                <div class="text-slate-400">
                  {{ $t("events.dtstart") }}
                </div>
                <div class="text-slate-500">
                  {{ $utils.formatDate(event?.dtstart || "") }}
                </div>
              </div>
              <div class="grid gap-2">
                <div class="text-slate-400">
                  {{ $t("events.dtend") }}
                </div>
                <div class="text-slate-500">
                  {{ $utils.formatDate(event?.dtend || "") }}
                </div>
              </div>
            </div>
            <div class="flex gap-2" v-if="event?.recurrence_freq">
              <div class="text-slate-400">
                {{ $t("events.recurrence") }}
              </div>
              <div class="text-slate-500">
                {{ $t(`events.recurrenceopts.${event.recurrence_freq}`) }}
              </div>
            </div>
            <div class="flex gap-2" v-if="event?.recurrence_count">
              <div class="text-slate-400">
                {{ $t("events.recurrence_count") }}
              </div>
              <div class="text-slate-500">
                {{ $t(`events.recurrenceopts.${event.recurrence_count}`) }}
              </div>
            </div>
            <div class="flex gap-2" v-if="event?.recurrence_until">
              <div class="text-slate-400">
                {{ $t("events.recurrence_until") }}
              </div>
              <div class="text-slate-500">
                {{ $utils.formatDate(event.recurrence_until) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarContent>
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
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import useUI from "core/src/composables/ui";
import useEventsStore from "@/stores/events";
import type { Event } from "@/types/events";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import SidebarActions from "core/src/components/sidebar/SidebarActions.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import IconButton from "core/src/components/IconButton.vue";

interface EditEventSidebarProps {
  open: boolean;
  event?: Event;
  hideDescription?: boolean;
}

const emit = defineEmits(["update:open", "add", "update", "close"]);
const props = withDefaults(defineProps<EditEventSidebarProps>(), {});

const { toast } = useUI();
const { t } = useI18n();
const eventStore = useEventsStore();

const isAddAction = computed(() => props.event?.id == null);
const isEdit = ref(false);

const recurrenceOptions: Event["recurrence_freq"][] = [
  null,
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
];

watch(
  () => props.event,
  () => {
    isEdit.value = false;
  }
);

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
