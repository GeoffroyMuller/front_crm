<template>
  <Sidebar :open="open" @update:open="emit('update:open', $event)">
    <SidebarHead
      :title="$t('pages.projects.new-projects')"
      :actions="[]"
    ></SidebarHead>
    <Form @submit="create">
      <SidebarContent class="grid gap-4">
        <TextField name="name" :label="$t('pages.projects.form.name')" />
        <ColorPicker
          allow-all-colors
          name="color"
          :label="$t('pages.projects.form.color')"
          :menuProps="{
            placement: 'bottom',
            alignement: 'start',
          }"
        />
        <!-- <IconPicker :label="$t('pages.projects.form.icon')" /> -->
      </SidebarContent>
      <SidebarActions class="flex justify-end">
        <Button color="success" type="submit">
          {{ $t("pages.projects.create-project") }}
        </Button>
      </SidebarActions>
    </Form>
  </Sidebar>
</template>

<script setup lang="ts">
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import TextField from "core/src/components/form/TextField.vue";
import ColorPicker from "core/src/components/form/colorpicker/ColorPicker.vue";
import Form from "core/src/components/form/Form.vue";
import SidebarActions from "core/src/components/sidebar/SidebarActions.vue";
import Button from "core/src/components/Button.vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(["update:open", "save"]);

function create(data: any) {
  emit("save", data);
  emit("update:open", false);
}
</script>
