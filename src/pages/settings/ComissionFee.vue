<template>
  <Card :title="$t('settings-page.commission-fee.title')">
    <Grid :gap="1">
      <Switch
        name="fee"
        v-model="withFee"
        :label="$t('settings-page.commission-fee.with-fee')"
      />
      <Grid :gap="1" v-if="withFee" :columns="2">
        <MagicDataTable
          :label="$t('settings-page.commission-fee.roles')"
          :store="roleStore"
          :columns="[
            { key: 'name', title: $t('settings-page.role.rolename') },
            { key: 'fee', title: $t('settings-page.commission-fee.fee') },
          ]"
        >
          <template #content-fee="{ item }">
            <TextField
              v-model="commissionFeesRole[item.id]"
              type="number"
              :step="0.1"
              :min="0"
              :max="100"
            ></TextField>
          </template>
        </MagicDataTable>
        <MagicDataTable
          :label="$t('settings-page.commission-fee.users')"
          :store="usersStore"
          :columns="[
            { key: 'email', title: t('email') },
            { key: 'fee', title: $t('settings-page.commission-fee.fee') },
          ]"
        >
          <template #content-fee="{ item }">
            <TextField
              v-model="commissionFeesUser[item.id]"
              type="number"
              :step="0.1"
              :min="0"
              :max="100"
            ></TextField>
          </template>
          <template #content-role="{ item }">
            {{ item.role?.name || "" }}
          </template>
        </MagicDataTable>
      </Grid>
      <Flex>
        <Button color="primary" @click="save">
          {{ $t("save") }}
        </Button>
      </Flex>
    </Grid>
  </Card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Button from "@/core/components/Button.vue";
import Card from "@/core/components/Card.vue";
import Switch from "@/core/components/form/Switch.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import useRoleStore from "@/stores/roles";
import useUserStore from "@/stores/user";
import { useI18n } from "vue-i18n";
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import type { ID } from "@/types/utils";
import TextField from "@/core/components/form/TextField.vue";

const { t } = useI18n();
const usersStore = useUserStore();
const roleStore = useRoleStore();

type CommissionFees = {
  [key: ID]: number;
};

const withFee = ref(false);
const commissionFeesUser = ref<CommissionFees>({});
const commissionFeesRole = ref<CommissionFees>({});

function save() {
  console.error(commissionFeesRole.value, commissionFeesUser.value);
}
</script>
