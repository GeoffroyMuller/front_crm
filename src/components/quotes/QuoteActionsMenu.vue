<template>
  <Menu placement="left">
    <template #activator>
      <IconButton name="more_horiz" />
    </template>
    <template #content>
      <div class="quote-actions">
        <Button
          @click.stop="$emit('setArchived', item)"
          color="danger"
          icon="archive"
          v-if="!item?.archived"
          variant="outlined"
        >
          {{ $t("archive") }}
        </Button>

        <Button
          @click.stop="$emit('preview', item)"
          color="primary"
          icon="preview"
          variant="outlined"
        >
          {{ $t("preview") }}
        </Button>

        <Button
          @click.stop="$emit('downloadPdf', item)"
          color="primary"
          icon="download"
          variant="outlined"
        >
          {{ $t("download") }}
        </Button>

        <Button
          @click.stop="$emit('sendMail', item)"
          color="success"
          icon="mail"
          variant="outlined"
        >
          {{ $t("send_by_mail") }}
        </Button>
      </div>
    </template>
  </Menu>
</template>
<script setup lang="ts">
import type { Quote } from "@/types/quote";
import Button from "@/core/components/Button.vue";
import IconButton from "@/core/components/IconButton.vue";
import Menu from "@/core/components/Menu.vue";

const emit = defineEmits([]);

interface QuoteActionsMenuProps {
  item: Quote;
}
const props = withDefaults(defineProps<QuoteActionsMenuProps>(), {});
</script>

<style lang="scss">
.quote-actions {
  display: grid;
  gap: spacing(0.5);
  button {
    width: 100%;
  }
}
</style>
