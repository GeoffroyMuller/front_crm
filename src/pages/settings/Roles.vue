<template>
  <MagicDataTable
    :store="roleStore"
    :columns="[{ key: 'name', title: $t('settings.role.rolename') }]"
    @row-click="handleRowClick"
  >
    <template #actions-title>
      <Button color="success" @click.stop="handleClickAdd">
        {{ $t("add") }}
      </Button>
    </template>
    <template #actions="{ item }">
      <Button
        @click.stop="deleteRole(item)"
        color="danger"
        icon="delete"
        v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
        variant="outlined"
      />
    </template>
  </MagicDataTable>

  <Sidebar v-model:open="isSidebarOpen">
    <Form :model-value="roleSelected" @submit="handleSubmit">
      <template #default="{ hasError }">
        <Grid :p="2" :gap="3">
          <div class="title">
            {{
              isAddAction
                ? $t("settings.role.new-role")
                : $t("settings.role.role")
            }}
          </div>
          <Grid :gap="1">
            <TextField name="name" :label="$t('settings.role.rolename')">
            </TextField>
            <Grid :mb="1" :mt="1">
              <div class="subtitle">
                {{ $t("settings.role.rights") }}
              </div>
            </Grid>
            <Switch
              v-for="right in rights"
              :key="right.id"
              :name="right.id + ''"
              :label="right.name"
            />
          </Grid>
          <Flex align-items="center" justify-content="end">
            <Button
              type="submit"
              color="success"
              icon="add"
              :disabled="hasError"
            >
              {{ isAddAction ? $t("add") : $t("save") }}
            </Button>
          </Flex>
        </Grid>
      </template>
    </Form>
  </Sidebar>
</template>

<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import Form from "@/core/components/form/Form.vue";
import Switch from "@/core/components/form/Switch.vue";
import TextField from "@/core/components/form/TextField.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useRightStore from "@/stores/rights";
import useRoleStore from "@/stores/roles";
import type { Role } from "@/types/roles";
import type { ID } from "@/types/utils";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["add", "update"]);

const roleSelected = ref<Role>();
const isSidebarOpen = ref(false);

const roleStore = useRoleStore();
const rightStore = useRightStore();
const { toast, confirm } = useUI();
const { t } = useI18n();

const isAddAction = computed(() => roleSelected.value == null);

const rights = computed(() => rightStore.getList);

onMounted(() => {
  rightStore.fetchList();
});

function handleClickAdd() {
  roleSelected.value = undefined;
  isSidebarOpen.value = true;
}

function handleRowClick(data: Role) {
  roleSelected.value = data;
  isSidebarOpen.value = true;
}

async function handleSubmit(data: Role) {
  if (isAddAction.value) {
    try {
      const newRole = await roleStore.create(data);
      emit("add", newRole);
      toast({
        type: "success",
        message: t("saved"),
      });
      isSidebarOpen.value = false;
      roleStore.fetchList();
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
    }
  } else {
    try {
      const id = roleSelected.value?.id as ID;
      const c = await roleStore.update(id, data);
      emit("update", {
        data: c,
        id,
      });
      toast({
        type: "success",
        message: t("saved"),
      });
      isSidebarOpen.value = false;
      roleStore.fetchList();
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
    }
  }
}

async function deleteRole(role: Role) {
  if (await confirm("settings.role.sure_delete_role")) {
    try {
      await roleStore.delete(role.id);
      toast({
        type: "primary",
        message: t("deleted"),
      });
      await roleStore.fetchList();
    } catch (err) {
      console.error(err);
      toast({
        type: "danger",
        message: t("error_occured"),
      });
    }
  }
}
</script>
