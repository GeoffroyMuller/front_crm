<template>
  <div class="edit-customer-form" v-if="isPageLoaded">
    <Form :defaultValue="customer" @submit="handleSubmit">
      <template v-slot:default="{ hasError }">
        <div class="title">
          {{
            isAddAction
              ? "Ajout d'un utilisateur"
              : `${customer.firstname} ${customer.lastname}`
          }}
        </div>
        <TextField name="firstname" label="Prenom" :rules="[$rules.required()]" />
        <TextField name="lastname" label="Nom" :rules="[$rules.required()]" />
        <TextField name="email" type="email" label="Email" :rules="[$rules.required()]" />

        <TextField name="description" label="Description" multiline />

        <Select
          name="gender"
          label="Genre"
          :options="[
            { label: 'Monsieur', value: 'M' },
            { label: 'Madame', value: 'Mme' },
          ]"
          :rules="[$rules.required()]"
        />

        <DatePicker
          name="birthdate"
          label="Date de naissance"
          :rules="[$rules.required()]"
        />

        <Autocomplete
          label="Ville"
          name="city"
          auto-filter
          :rules="[$rules.required()]"
          :options="[
            { label: 'Metz', value: 'Metz' },
            { label: 'Paris', value: 'Paris' },
            { label: 'Nancy', value: 'Nancy' },
            { label: 'Noisseville', value: 'Noisseville' },
            { label: 'Lyon', value: 'Lyon' },
          ]"
        />

        <RadioGroup
          label="Valide"
          name="valid"
          :options="[
            { label: 'Oui', value: true },
            { label: 'Non', value: false },
          ]"
          :rules="[$rules.required()]"
        />

        <Switch label="Authorisé" name="authorized" />

        <Button
          v-if="isAddAction"
          type="submit"
          :loading="loading"
          :disabled="hasError"
          icon="save"
        >
          Ajouter
        </Button>
        <Button v-else type="submit" :loading="loading" :disabled="hasError" icon="save">
          Modifier
        </Button>
      </template>
    </Form>
  </div>
  <div v-else>
    <Spinner />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCustomerStore } from "@/features/stores/customers";
import Card from "@/core/components/Card.vue";
import TextField from "@/core/components/form/TextField.vue";
import Form from "@/core/components/form/Form.vue";
import { isNil } from "lodash";
import Button from "@/core/components/Button.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import Select from "@/core/components/form/Select.vue";
import DatePicker from "@/core/components/form/DatePicker.vue";
import Autocomplete from "@/core/components/form/Autocomplete.vue";
import RadioGroup from "@/core/components/form/RadioGroup.vue";
import Switch from "@/core/components/form/Switch.vue";
import Spinner from "@/core/components/Spinner.vue";

interface CustomerFormProps {
  customerId?: number | string;
  isAddAction?: boolean;
}

const props = withDefaults(defineProps<CustomerFormProps>(), {});
const emit = defineEmits(["done"]);

const customerStore = useCustomerStore();

const route = useRoute();

const isPageLoaded = computed(() => props.isAddAction || !isNil(customer.value));

const loading = ref(false);

const customer = computed(() => {
  if (props.isAddAction) {
    return null;
  }
  return customerStore.getById(props.customerId as string);
});

const { toast, confirm } = useUI();

async function handleSubmit(data: any) {
  loading.value = true;
  try {
    if (props.isAddAction) {
      await customerStore.create(data);
      toast({
        type: "success",
        message: `Utilisateur créé avec succes`,
      });
    } else {
      await customerStore.update(route.params.id, data);
      toast({
        type: "success",
        message: `Utilisateur <b>${customer.value.firstname}${
          customer.value.lastname ? " " + customer.value.lastname : ""
        }</b> modifié avec succes`,
      });
    }
    emit("done");
  } catch (err) {
    console.error(err);
    toast({
      type: "danger",
      message: `Erreur lors de la modification`,
    });
  }
  loading.value = false;
}
</script>

<style lang="scss" scoped>
.edit-customer-form {
  form {
    width: 100%;
    @include flex(col, center, flex-start, 1.5);
  }
}
</style>
