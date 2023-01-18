<template>
  <Sidebar :open="open" @update:open="($event) => $emit('update:open', $event)">
    <Form :model-value="event" class="edit-client-form" @submit="handleSubmit">
      <template #default="{ hasError }">
        <div class="title">
          {{ isAddAction ? $t("events.new-event") : $t("events.event") }}
        </div>
        <TextField
          :rules="$yup.string().required()"
          name="description"
          :label="$t('descriptions')"
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
import Card from "@/core/components/Card.vue";
import Form from "@/core/components/form/Form.vue";
import TextField from "@/core/components/form/TextField.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useEventsStore from "@/stores/events";
import type { Event } from "@/types/events";
import { computed, ref } from "vue";
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

const isAddAction = computed(() => props.event == null);

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

<style lang="scss" scoped></style>
