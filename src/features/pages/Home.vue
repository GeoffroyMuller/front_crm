<template>
  <Form @submit="handleSubmit">
    {{ $_.isNil({ a: 1 }) }}
    {{ $_.isNil(undefined) }}

    <TextField name="test" v-if="displayTextField" />
    <TextField name="testqsdqs" v-if="displayTextField" @change="a" />
    <Button type="button" @click="displayTextField = !displayTextField">
      {{
        !displayTextField ? "Afficher les textfield" : "Supprimer les textfield"
      }}
    </Button>
    <Button type="submit"> Enregistrer </Button>
  </Form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Form from "../../core/components/form/Form.vue";
import TextField from "../../core/components/form/TextField.vue";
import Button from "../../core/components/Button.vue";

const displayTextField = ref(false);
function a() {
  console.error("sdqsL");
}
function handleSubmit(formValues: any) {
  console.error({ formValues });
}
</script>
