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
    <Form :initial-value="roleSelected" @submit="handleSubmit">
      <template #default="{ hasError, value }">
        <Grid :p="2" :gap="3">
          <div class="title">
            {{
              isAddAction
                ? $t("settings-page.role.new-role")
                : $t("settings-page.role.role")
            }}
          </div>
          <Grid :gap="1">
            <TextField name="name" :label="$t('settings-page.role.rolename')">
            </TextField>
            <Grid :mb="1" :mt="1">
              <div class="subtitle">
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
import Button from "core/src/components/Button.vue";
import Form from "core/src/components/form/Form.vue";
import Switch from "core/src/components/form/Switch.vue";
import TextField from "core/src/components/form/TextField.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Sidebar from "core/src/components/Sidebar.vue";
import useUI from "core/src/helpers/vue/composables/ui";
import useRoleStore from "@/stores/roles";
import type { Role } from "@/types/roles";
import type { ID } from "@/types/utils";
import { xor } from "lodash";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

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
  if (await confirm(t("settings-page.role.sure_delete_role"))) {
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
