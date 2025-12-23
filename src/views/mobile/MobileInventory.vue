<template>
  <div class="mobile-inventory">
    <div class="flex align-items-center justify-content-between mb-3">
      <h2 class="m-0 text-primary">Stock Monitoring</h2>
      <Button icon="pi pi-refresh" text rounded @click="fetchReceipts" :loading="isLoading" />
    </div>

    <!-- Search Bar -->
    <div class="p-inputgroup mb-3">
      <span class="p-inputgroup-addon">
        <i class="pi pi-search"></i>
      </span>
      <InputText
        v-model="searchQuery"
        placeholder="Search receipt # or supplier..."
        class="w-full"
      />
    </div>

    <!-- Stock Receipts List (Card Style) -->
    <div class="flex flex-column gap-2">
      <div v-if="!isLoading">
        <Card
          v-for="receipt in filteredReceipts"
          :key="receipt.id"
          class="mb-2 shadow-1"
          @click="viewReceiptDetails(receipt)"
        >
          <template #content>
            <div class="flex justify-content-between align-items-start">
              <div class="flex flex-column flex-1 pr-2">
                <span class="font-bold text-lg line-height-2">#{{ receipt.receipt_number }}</span>
                <span class="text-500 text-sm">
                  {{ receipt.supplier?.name || 'No Supplier' }}
                </span>
                <div class="flex gap-2 mt-1">
                  <Tag :value="receipt.status" severity="success" class="text-xs" />
                </div>
              </div>
              <div class="flex flex-column align-items-end">
                <span class="text-xl font-bold text-primary">
                  LKR {{ formatCurrency(receipt.total_amount) }}
                </span>
                <span class="text-500 text-xs">{{ formatDate(receipt.received_date) }}</span>
              </div>
            </div>
          </template>
        </Card>
        <div v-if="filteredReceipts.length === 0" class="text-center py-5 text-500">
          <i class="pi pi-search-minus text-4xl mb-2 block"></i>
          No receipts found
        </div>
      </div>
      <div v-else class="flex flex-column gap-2">
        <Skeleton v-for="i in 6" :key="i" height="6rem" />
      </div>
    </div>

    <!-- Receipt Details Dialog -->
    <Dialog
      v-model:visible="showReceiptDetails"
      :header="'Receipt #' + selectedReceipt?.receipt_number"
      position="bottom"
      :modal="true"
      :draggable="false"
      :breakpoints="{ '960px': '95vw' }"
      class="mobile-dialog"
    >
      <div v-if="selectedReceipt" class="p-2">
        <div class="grid mb-3">
          <div class="col-6">
            <div class="text-500 text-xs mb-1">Supplier</div>
            <div class="font-semibold">{{ selectedReceipt.supplier?.name }}</div>
          </div>
          <div class="col-6">
            <div class="text-500 text-xs mb-1">Date</div>
            <div class="font-semibold">{{ formatDate(selectedReceipt.received_date) }}</div>
          </div>
          <div class="col-6">
            <div class="text-500 text-xs mb-1">Status</div>
            <Tag :value="selectedReceipt.status" severity="success" />
          </div>
          <div class="col-6">
            <div class="text-500 text-xs mb-1">Total Amount</div>
            <div class="font-bold text-primary">
              LKR {{ formatCurrency(selectedReceipt.total_amount) }}
            </div>
          </div>
        </div>

        <Divider align="left">
          <span class="text-sm font-bold">Items</span>
        </Divider>

        <div class="flex flex-column gap-2">
          <div
            v-for="item in selectedReceipt.items"
            :key="item.id"
            class="p-2 surface-100 border-round text-sm"
          >
            <div class="font-semibold">{{ item.product?.name }}</div>
            <div class="flex justify-content-between text-xs text-600 mt-1">
              <span>{{ item.quantity }} @ LKR {{ formatCurrency(item.cost_price) }}</span>
              <span class="font-bold">
                LKR {{ formatCurrency(item.quantity * item.cost_price) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { StockReceiptService } from '@/services/StockReceiptService';
import { computed, onMounted, ref } from 'vue';

const isLoading = ref(true);
const receipts = ref([]);
const searchQuery = ref('');
const selectedReceipt = ref(null);
const showReceiptDetails = ref(false);

const filteredReceipts = computed(() => {
  if (!searchQuery.value) return receipts.value;
  const query = searchQuery.value.toLowerCase();
  return receipts.value.filter(
    (r) =>
      r.receipt_number.toLowerCase().includes(query) ||
      (r.supplier?.name && r.supplier.name.toLowerCase().includes(query))
  );
});

async function fetchReceipts() {
  isLoading.value = true;
  try {
    const result = await StockReceiptService.getAllReceipts();
    if (result.success) {
      receipts.value = result.data;
    }
  } catch (error) {
    console.error('Error fetching mobile receipts:', error);
  } finally {
    isLoading.value = false;
  }
}

function viewReceiptDetails(receipt) {
  selectedReceipt.value = receipt;
  showReceiptDetails.value = true;
}

function formatCurrency(value) {
  return parseFloat(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString();
}

onMounted(() => {
  fetchReceipts();
});
</script>

<style scoped>
.mobile-inventory {
  max-width: 100%;
}
:deep(.p-card-content) {
  padding: 0.5rem 0;
}
</style>
