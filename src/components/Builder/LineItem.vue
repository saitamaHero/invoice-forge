<template>
    <div class="d-flex justify-space-between align-center mb-1">
        <span class="text-caption font-weight-bold">Item {{ i + 1 }}</span>
        <v-btn icon="mdi-delete" size="x-small" color="error" variant="text" @click="removeItem(i)"></v-btn>
    </div>

    <v-text-field v-model="item.desc" label="Description" variant="outlined" density="compact" hide-details
        class="mb-2"></v-text-field>

    <v-row dense>
        <v-col cols="5">
            <v-text-field v-model.number="item.qty" type="number" label="Qty" variant="outlined" density="compact"
                hide-details></v-text-field>
        </v-col>
        <v-col cols="7">
            <v-text-field v-model.number="item.price" type="number" label="Price" prefix="$" variant="outlined"
                density="compact" hide-details></v-text-field>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    defineProps<{
        
    }>()
</script>

<style scoped></style>