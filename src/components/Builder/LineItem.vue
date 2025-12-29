<template>
    <div class="d-flex justify-space-between align-center mb-1">
        <span class="text-caption font-weight-bold">Item</span>
        <v-btn icon="mdi-delete" size="x-small" color="error" variant="text"
            @click="$emit('removeItem', item.id ?? undefined)"></v-btn>
    </div>

    <v-text-field v-model="item.description" label="Description" variant="outlined" density="compact" hide-details
        class="mb-2"></v-text-field>

    <v-row dense>
        <v-col cols="5">
            <v-text-field v-model.number="item.quantity" type="number" label="Qty" variant="outlined" density="compact"
                hide-details></v-text-field>
        </v-col>
        <v-col cols="7">
            <v-text-field v-model.number="item.price" type="number" label="Price" prefix="$" variant="outlined"
                density="compact" hide-details></v-text-field>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import type { LineItem } from '../../types/invoice';

    defineProps<{
        item: LineItem
    }>()

    defineEmits<{
        (e: 'removeItem', id?: string | number): void
    }>()
</script>

<style scoped></style>