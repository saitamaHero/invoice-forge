<template>
  <v-app>
    <v-app-bar color="indigo-darken-1" density="compact" elevation="2">
      <v-app-bar-title>Invoice Forge</v-app-bar-title>

      <v-spacer></v-spacer>

      <div style="width: 150px" class="me-2">
        <v-select v-model="locale" :items="availableLocales" item-title="title" item-value="value"
          prepend-inner-icon="mdi-translate" density="compact" variant="outlined" hide-details rounded="lg"
          color="white" base-color="white"></v-select>
      </div>
      <v-btn prepend-icon="mdi-refresh" variant="text" @click="resetForm">
        {{ t('button.reset') }}
      </v-btn>

      <v-btn class="ms-2" variant="elevated" color="white" style="color: #3949AB" append-icon="mdi-download"
        @click="generatePDF">
        {{ t('button.download.file', {label: 'PDF'}) }}
      </v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-0 pa-md-4">
        <v-row>

          <v-col cols="12" md="4" lg="3">
            <v-card elevation="2">
              <v-card-title class="text-subtitle-2 text-uppercase font-weight-bold text-grey-darken-1 py-3">
                Editor
              </v-card-title>

              <v-expansion-panels v-model="activePanel" variant="accordion">

                <v-expansion-panel value="meta" :title="t('editor.invoice_details.title')">
                  <v-expansion-panel-text>
                    <v-text-field v-model="data.invoiceNum" :label="t('editor.invoice_details.invoice_num')"
                      variant="outlined" density="compact" hide-details class="mb-3"></v-text-field>

                    <v-date-input v-model="data.date" :label="t('editor.invoice_details.date')" prepend-icon=""
                      variant="outlined"></v-date-input>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel value="from" :title="t('editor.from.title')">
                  <v-expansion-panel-text>
                    <v-text-field v-model="data.from.name" :label="t('editor.from.name')" variant="outlined"
                      density="compact" class="mb-3" hide-details></v-text-field>
                    <v-text-field v-model="data.from.documentId" :label="t('editor.from.documentId')" variant="outlined" density="compact"
                      hide-details class="mb-3" placeholder="123-4567890-1"></v-text-field>

                    <v-textarea v-model="data.from.address" :label="t('editor.from.address')" variant="outlined" density="compact"
                      rows="3" hide-details></v-textarea>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel value="to" :title="t('editor.to.title')">
                  <v-expansion-panel-text>
                    <v-text-field v-model="data.to.name" :label="t('editor.to.name')" variant="outlined" density="compact"
                      class="mb-3" hide-details></v-text-field>
                    <v-textarea v-model="data.to.address" class="mb-3" :label="t('editor.to.address')" variant="outlined"
                      density="compact" rows="3" hide-details></v-textarea>
                    <v-textarea v-model="data.to.sentTo" :label="t('editor.to.sentTo')  " variant="outlined" density="compact" rows="3"
                      hide-details></v-textarea>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel value="items" :title="t('editor.line_items.title')">
                  <v-expansion-panel-text class="px-2">

                    <div v-for="(item, i) in data.items" :key="i" class="mb-4 pt-2 border-t">
                      <LineItem :item="item" @removeItem="removeItem"></LineItem>
                    </div>

                    <v-btn block color="indigo-lighten-1" variant="tonal" prepend-icon="mdi-plus" @click="addItem">
                      Add Item
                    </v-btn>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel value="notes" title="Notes & Terms">
                  <v-expansion-panel-text>
                    <v-textarea v-model="data.notes" label="Payment Terms / Notes" variant="outlined" density="compact"
                      rows="4" hide-details></v-textarea>
                  </v-expansion-panel-text>
                </v-expansion-panel>

              </v-expansion-panels>
            </v-card>
          </v-col>

          <v-col cols="12" md="8" lg="9" class="d-flex justify-center bg-grey-lighten-2 pa-4"
            style="height: calc(100vh - 64px); overflow-y: auto;">

            <div id="invoice-preview" class="invoice-paper">
              <div v-html="compiledHtml"></div>
            </div>

          </v-col>

        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Handlebars from 'handlebars'
import html2pdf from 'html2pdf.js'
import { setupHandlebars } from '../utils/handlerbars.util'
import rawTemplate from '../assets/default-template.handlebars?raw';
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon';
import LineItem from './Builder/LineItem.vue'
import { nanoid } from 'nanoid';
import { newLineItem } from '../utils/line-items.util';

const activePanel = ref('items') // Default open panel
const { t, locale } = useI18n()
const availableLocales = [
  { title: 'Español', value: 'es' },
  { title: 'English', value: 'en' }
]
const data = reactive({
  invoiceNum: '1',
  date: new Date(),
  from: {
    name: '[Your Name or Company]',
    address: '123 Designer Blvd\nNew York, NY 10012',
    documentId: '[123-4567890-1]'
  },
  to: {
    name: '[Client Name or Company]',
    address: '[Client Address]',
    sentTo: '[Contact Person]'
  },
  items: [
    newLineItem({ description: 'Honorarios mes de ' + DateTime.now().setLocale(navigator.language).toFormat('LLLL') }),
  ],
  notes: '[Add payment terms or notes here]',
  currency: 'USD'
})

const addItem = () => data.items.push(newLineItem({ description: 'new item', id: nanoid() }))
const removeItem = (i) => data.items.splice(i, 1)
const resetForm = () => {
  if (confirm('Clear all data?')) {
    data.items = []
    data.from = { name: '', address: '' }
    data.to = { name: '', address: '' }
  }
}

setupHandlebars()

const compiledHtml = computed(() => {
  try {
    const template = Handlebars.compile(rawTemplate)
    const templateData = { ...data }

    if (templateData.date instanceof Date) {
      const dt = DateTime.fromJSDate(templateData.date)
        .setZone(Intl.DateTimeFormat()
        .resolvedOptions().timeZone)
        .setLocale(navigator.language);
      templateData.date = dt.toLocaleString(DateTime.DATE_SHORT)
    }
    return template(templateData)
  } catch (e) {
    return 'Template Error...'
  }
})


const generatePDF = () => {
  const element = document.querySelector('.invoice-wrapper')
  const opt = {
    margin: 10, // mm
    filename: `Invoice_${data.invoiceNum}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true, windowWidth: 800 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }
  html2pdf().set(opt).from(element).save()
}
</script>

<style scoped>
/* Visual Container for the Preview.
  This makes it look like a piece of paper on the screen.
*/
.invoice-paper {
  background: white;
  width: 210mm;
  /* A4 Width */
  min-height: 297mm;
  /* A4 Height */
  padding: 10mm;
  /* Visual padding matching PDF margin */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
</style>