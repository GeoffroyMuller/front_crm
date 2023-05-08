<template>
  <MagicDataTable
    :columns="[
      { key: 'dtstart', title: $t('events.start') },
      { key: 'dtend', title: $t('events.end') },
    ]"
    :store="eventStore"
    :label="$t('events.events')"
    @row-click="onClickEvent"
  >
    <template #content-dtstart="{ item }">
      {{ $utils.formatDate(item.dtstart) }}
    </template>
    <template #content-dtend="{ item }">
      {{ $utils.formatDate(item.dtend) }}
    </template>
    <template #actions-title>
      <div>
        <Button color="success" icon="add" @click.stop="onAddEvent">
          {{ $t("add") }}
        </Button>
      </div>
    </template>
  </MagicDataTable>

  <EditEventSidebar
    hide-description
    @add="eventStore.fetchList()"
    @update="eventStore.fetchList()"
    :event="event"
    v-model:open="eventSidebarOpen"
  />
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import useProductsStore from "@/modules/products/stores/products";
import type { Event } from "@/types/events";
import type { Product } from "@/types/product";
import { ref } from "vue";
import EditEventSidebar from "@/components/events/EditEventSidebar.vue";

interface ProductAvancedSettingsEventProps {
  product: Product | null;
}

const productStore = useProductsStore();
const emit = defineEmits(["saved", "cancel"]);
const props = withDefaults(defineProps<ProductAvancedSettingsEventProps>(), {
  product: null,
});

const eventStore = productStore.getDerivedStore<Event>(
  props.product?.id as string,
  "events",
  {
    path: "events",
    filters: {
      $eq: {
        idProduct: props.product?.id,
      },
    },
  }
);

const eventSidebarOpen = ref(false);
const event = ref<Event>();

function onAddEvent() {
  event.value = { idProduct: props.product?.id, recurrence_freq: null };
  eventSidebarOpen.value = true;
}

function onClickEvent(e: Event) {
  event.value = e;
  eventSidebarOpen.value = true;
}
</script>
