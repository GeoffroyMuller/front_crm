<template>
  <Page :title="$t('home')">
    <Flex :gap="1">
      <Chip text="blabla" color="success" icon="mail" />
      <Chip text="blabla" color="black" icon="mail" />
      <Chip text="blabla" color="danger" icon="mail" />
      <Chip text="blabla" color="primary" icon="mail" />
      <Chip text="blabla" color="warning" icon="mail" />
    </Flex>
    <Flex :gap="1">
      <Chip text="blabla" color="success" icon="mail" is-closable />
      <Chip text="blabla" color="black" icon="mail" is-closable />
      <Chip text="blabla" color="danger" icon="mail" is-closable />
      <Chip text="blabla" color="primary" icon="mail" is-closable />
      <Chip text="blabla" color="warning" icon="mail" is-closable />
    </Flex>
    <Flex :gap="1">
      <Chip text="blabla" color="success" icon="mail" is-outline />
      <Chip text="blabla" color="black" icon="mail" is-outline />
      <Chip text="blabla" color="danger" icon="mail" is-outline />
      <Chip text="blabla" color="primary" icon="mail" is-outline />
      <Chip text="blabla" color="warning" icon="mail" is-outline />
    </Flex>
    <Flex :gap="1">
      <Chip text="blabla" color="success" icon="mail" is-outline is-closable />
      <Chip text="blabla" color="black" icon="mail" is-outline is-closable />
      <Chip text="blabla" color="danger" icon="mail" is-outline is-closable />
      <Chip text="blabla" color="primary" icon="mail" is-outline is-closable />
      <Chip text="blabla" color="warning" icon="mail" is-outline is-closable />
    </Flex>
    <ColorPicker label="Color" />
  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import Chip from "core/src/components/Chip.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import ColorPicker from "core/src/components/form/colorpicker/ColorPicker.vue";
</script>
