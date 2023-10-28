<template>
  <MagicDataTable
    :store="roleStore"
    :columns="[{ key: 'name', title: $t('settings-page.role.rolename') }]"
    @row-click="handleRowClick"
  >
    <template #actions-title>
      <Button color="success" @click.stop="handleClickAdd">
        {{ $t("add") }}
      </Button>
    </template>
    <template #actions="{ item }">
      <IconButton
        @click.stop="deleteRole(item)"
        color="danger"
        default-colored
        name="delete"
        v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
      />
    </template>
  </MagicDataTable>

  <Sidebar v-model:open="isSidebarOpen">
    <SidebarHead
      :title="
        isAddAction
          ? $t('settings-page.role.new-role')
          : $t('settings-page.role.role')
      "
      :actions="[]"
    ></SidebarHead>
    <SidebarContent>
      <Form :initial-value="roleSelected" @submit="handleSubmit">
        <template #default="{ hasError, value }">
          <Grid :gap="3">
            <Grid :gap="2">
              <TextField name="name" :label="$t('settings-page.role.rolename')">
              </TextField>
              <Grid :mb="1" :mt="1">
                <div class="typo-title6">
                  {{ $t("settings-page.role.rights") }}
                </div>
              </Grid>

              <Switch
                v-for="r in rights"
                :key="r.id"
                :label="r.lang.fr"
                :model-value="rightsSelected.find((rr: any) => rr == r.id)"
                @update:model-value="($val) => toggleValue($val, r)"
              />
            </Grid>
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
          </Grid>
        </template>
      </Form>
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Form from "core/src/components/form/Form.vue";
import Switch from "core/src/components/form/Switch.vue";
import TextField from "core/src/components/form/TextField.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import useUI from "core/src/composables/ui";
import useRoleStore from "@/stores/roles";
import type { Role } from "@/types/roles";
import type { ID } from "core/src/types";
import { xor } from "lodash";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import IconButton from "core/src/components/IconButton.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarActions from "core/src/components/sidebar/SidebarActions.vue";
import type { ConfirmFunc } from "core/src/components/types";

const emit = defineEmits(["add", "update"]);

function toggleValue(val: boolean, r: any) {
  const founded = rightsSelected.value.find((rs) => rs == r.id);
  if ((val && founded) || (!val && !founded)) {
    return;
  }
  rightsSelected.value = xor(rightsSelected.value, [r.id]);
}

const roleSelected = ref<Role>();
const isSidebarOpen = ref(false);
const rightsSelected = ref<Array<string>>([]);

const roleStore = useRoleStore();
const { toast, confirm } = useUI();
const { t } = useI18n();

const isAddAction = computed(() => roleSelected.value?.id == null);

onMounted(() => {
  roleStore.fetchRights();
});
const rights = computed(() => roleStore.rights);

function handleClickAdd() {
  roleSelected.value = undefined;
  rightsSelected.value = [];
  isSidebarOpen.value = true;
}

function handleRowClick(data: Role) {
  roleSelected.value = data;
  rightsSelected.value = data.rights;
  isSidebarOpen.value = true;
}

async function handleSubmit(data: Role) {
  data.rights = rightsSelected.value;
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
  const confirmConfig: ConfirmFunc["arguments"] = {
    message: t("settings-page.role.sure_delete_role"),
    type: "danger",
    actions: [
      {
        action: "cancel",
        label: t("cancel"),
        buttonProps: {
          variant: "text",
          color: "black",
        },
      },
      {
        action: "confirm",
        label: t("delete"),
        buttonProps: {
          icon: "delete",
          color: "danger",
        },
      },
    ],
  };
  if (await confirm(confirmConfig)) {
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
