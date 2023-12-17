<template>
  <Card padding class="grid xl:grid-cols-[1fr_max-content] gap-6 items-start">
    <div class="typo-title5 font-semibold">
      <div class="mb-6 flex items-center gap-0.5">
        {{ $t("pages.edit-company.informations") }}
        <IconButton
          @click.stop="$emit('edit')"
          color="primary"
          default-colored
          size="xs"
          name="edit"
        />
      </div>
      <div class="grid gap-5">
        <div class="flex gap-2" v-if="company?.name">
          <div class="text-slate-400">
            {{ $t("pages.edit-company.name") }}
          </div>
          <div class="text-slate-500">
            {{ company?.name }}
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import useVatStore from "@/stores/vat";
import type { Company } from "@/types/company";
import Price from "core/src/components/Price.vue";
import IconButton from "core/src/components/IconButton.vue";
import { computed } from "vue";
import Card from "core/src/components/card/Card.vue";

const props = defineProps<{
  company: Company;
}>();

defineEmits(["edit"]);
</script>
