<template>
  <div class="mobile-stock-receipts p-3 pb-8">
    <div class="flex align-items-center mb-4">
      <Button icon="pi pi-arrow-left" text rounded @click="$router.back()" class="mr-2" />
      <h1 class="text-2xl font-bold m-0">Stock Receipts</h1>
    </div>

    <div class="mb-4">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          placeholder="Search by Receipt # or Supplier"
          class="w-full"
        />
      </span>
    </div>

    <div v-if="isLoading" class="flex flex-column gap-3">
      <Skeleton v-for="i in 5" :key="i" height="100px" />
    </div>

    <div v-else-if="filteredReceipts.length === 0" class="text-center py-5">
      <i class="pi pi-inbox text-4xl text-300 mb-3"></i>
      <p class="text-500">No stock receipts found</p>
    </div>

    <div v-else class="flex flex-column gap-3">
      <Card
        v-for="receipt in filteredReceipts"
        :key="receipt.id"
        class="receipt-card border-none shadow-1"
        @click="viewDetails(receipt)"
      >
        <template #content>
          <div class="flex justify-content-between align-items-start">
            <div class="flex flex-column">
              <span class="font-bold text-lg">#{{ receipt.receipt_number }}</span>
              <span class="text-500 text-sm">{{ receipt.supplier?.name }}</span>
              <span class="text-400 text-xs mt-1">{{ formatDate(receipt.received_date) }}</span>
            </div>
            <div class="flex flex-column align-items-end">
              <span class="font-bold text-blue-600">
                LKR {{ formatCurrency(receipt.total_amount) }}
              </span>
              <Tag
                :value="receipt.status"
                :severity="getStatusSeverity(receipt.status)"
                class="mt-2"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Receipt Details Dialog -->
    <Dialog
      v-model:visible="showDetails"
      :header="'Receipt #' + selectedReceipt?.receipt_number"
      modal
      class="w-11"
      :draggable="false"
    >
      <div v-if="selectedReceipt" class="flex flex-column gap-4">
        <div class="grid">
          <div class="col-6">
            <div class="text-500 text-xs">Supplier</div>
            <div class="font-bold">{{ selectedReceipt.supplier?.name }}</div>
          </div>
          <div class="col-6">
            <div class="text-500 text-xs">Date</div>
            <div class="font-bold">{{ formatDate(selectedReceipt.received_date) }}</div>
          </div>
          <div class="col-6">
            <div class="text-500 text-xs">Status</div>
            <Tag
              :value="selectedReceipt.status"
              :severity="getStatusSeverity(selectedReceipt.status)"
            />
          </div>
          <div class="col-6">
            <div class="text-500 text-xs">Total Amount</div>
            <div class="font-bold text-blue-600">
              LKR {{ formatCurrency(selectedReceipt.total_amount) }}
            </div>
          </div>
        </div>

        <Divider />

        <div>
          <div class="font-bold mb-2">Items</div>
          <div class="flex flex-column gap-2">
            <div
              v-for="item in selectedReceipt.items"
              :key="item.id"
              class="p-2 bg-50 border-round"
            >
              <div class="font-semibold">{{ item.product?.name }}</div>
              <div class="flex justify-content-between text-sm mt-1">
                <span>
                  {{ item.quantity }} {{ item.unit }} @ LKR {{ formatCurrency(item.cost_price) }}
                </span>
                <span class="font-bold">
                  LKR {{ formatCurrency(item.quantity * item.cost_price) }}
                </span>
              </div>
              <div v-if="item.free_quantity > 0" class="text-xs text-green-600 mt-1">
                + {{ item.free_quantity }} Free
              </div>
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
const showDetails = ref(false);

const filteredReceipts = computed(() => {
  if (!searchQuery.value) return receipts.value;
  const query = searchQuery.value.toLowerCase();
  return receipts.value.filter(
    (r) =>
      r.receipt_number.toLowerCase().includes(query) ||
      r.supplier?.name.toLowerCase().includes(query)
  );
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusSeverity = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'info';
  }
};

const viewDetails = (receipt) => {
  selectedReceipt.value = receipt;
  showDetails.value = true;
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const res = await StockReceiptService.getAllReceipts();
    if (res.success) {
      receipts.value = res.data;
    }
  } catch (error) {
    console.error('Error fetching stock receipts:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.mobile-stock-receipts {
  background-color: #f8fafc;
  min-height: 100vh;
}
.receipt-card {
  cursor: pointer;
  transition: transform 0.1s;
}
.receipt-card:active {
  transform: scale(0.98);
}
.pb-8 {
  padding-bottom: 5rem;
}
</style>
