<template>
  <Sidebar :open="open" @update:open="($event) => $emit('update:open', $event)">
    <Form :model-value="event" class="edit-event-form" @submit="handleSubmit">
      <template #default="{ hasError }">
        <div class="title">
          {{ isAddAction ? $t("events.new-event") : $t("events.event") }}
        </div>
        <DatePicker name="dtstamp" :label="$t('dtstamp')" />
        <DatePicker name="dtstart" :label="$t('dtstart')" />
        <DatePicker name="dtend" :label="$t('dtend')" />

        <TextField name="summary" :label="$t('summary')" />
        <TextField name="description" :label="$t('descriptions')" />
        <TextField name="location" :label="$t('location')" />

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
import TextField from "@/core/components/form/TextField.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useEventsStore from "@/stores/events";
import type { Event } from "@/types/events";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

interface EditEventSidebarProps {
  open: boolean;
  event?: Event;
}

const emit = defineEmits(["update:open", "add", "update"]);
const props = withDefaults(defineProps<EditEventSidebarProps>(), {});

const { toast } = useUI();
const { t } = useI18n();
const eventStore = useEventsStore();

const isAddAction = computed(() => props.event?.id == null);

async function handleSubmit(data: any) {
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
