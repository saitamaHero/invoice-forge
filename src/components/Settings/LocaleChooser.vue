<template>
    <v-select v-model="locale" :items="availableLocales" item-title="title" item-value="value"
        prepend-inner-icon="mdi-translate" density="compact" variant="outlined" hide-details rounded="lg" color="white"
        base-color="white">
    </v-select>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n()

const availableLocales = [
  { title: 'Español', value: 'es' },
  { title: 'English', value: 'en' }
]
</script>