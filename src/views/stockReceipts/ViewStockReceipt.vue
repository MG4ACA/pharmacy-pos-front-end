<template>
  <div class="view-stock-receipt">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Stock Receipt Details</h1>
      <div class="flex gap-2">
        <Button
          v-if="receipt && receipt.status === 'draft'"
          label="Edit"
          icon="pi pi-pencil mr-2"
          @click="editReceipt"
        />
        <Button
          label="Back to List"
          icon="pi pi-arrow-left mr-2"
          class="p-button-secondary"
          @click="goBack"
        />
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="receipt">
      <!-- Receipt Header -->
      <Card class="mb-4">
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Receipt Information</span>
            <Tag :value="receipt.status" :severity="getStatusSeverity(receipt.status)" />
          </div>
        </template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-3">
              <div class="field">
                <label class="block text-500 mb-2">Receipt Number</label>
                <p class="font-bold text-xl m-0">{{ receipt.receipt_number }}</p>
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label class="block text-500 mb-2">Receipt Date</label>
                <p class="font-semibold m-0">{{ formatDate(receipt.receipt_date) }}</p>
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label class="block text-500 mb-2">Total Items</label>
                <p class="font-semibold text-lg m-0">{{ receipt.total_items }}</p>
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label class="block text-500 mb-2">Total Amount</label>
                <p class="font-bold text-xl text-primary m-0">
                  {{ formatCurrency(receipt.total_amount) }}
                </p>
              </div>
            </div>
          </div>

          <Divider />

          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="field">
                <label class="block text-500 mb-2">Supplier</label>
                <p class="font-semibold m-0">{{ receipt.supplier?.name || 'N/A' }}</p>
                <p v-if="receipt.supplier?.contact_person" class="text-sm text-500 m-0">
                  Contact: {{ receipt.supplier.contact_person }}
                </p>
                <p v-if="receipt.supplier?.phone" class="text-sm text-500 m-0">
                  <i class="pi pi-phone mr-1"></i>
                  {{ receipt.supplier.phone }}
                </p>
                <p v-if="receipt.supplier?.email" class="text-sm text-500 m-0">
                  <i class="pi pi-envelope mr-1"></i>
                  {{ receipt.supplier.email }}
                </p>
              </div>
            </div>
            <div class="col-12 md:col-6">
              <div class="field">
                <label class="block text-500 mb-2">Supplier Invoice</label>
                <p class="font-semibold m-0">
                  {{ receipt.supplier_invoice_number || 'Not specified' }}
                </p>
                <p v-if="receipt.supplier_invoice_date" class="text-sm text-500 m-0">
                  Date: {{ formatDate(receipt.supplier_invoice_date) }}
                </p>
              </div>
            </div>
            <div class="col-12" v-if="receipt.notes">
              <div class="field">
                <label class="block text-500 mb-2">Notes</label>
                <p class="m-0">{{ receipt.notes }}</p>
              </div>
            </div>
            <div class="col-12">
              <div class="field">
                <label class="block text-500 mb-2">Created By</label>
                <p class="m-0">
                  {{ receipt.creator?.full_name || 'Unknown' }} •
                  {{ formatDateTime(receipt.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Product Lines -->
      <Card>
        <template #title>Product Lines ({{ receipt.entries?.length || 0 }})</template>
        <template #content>
          <DataTable :value="receipt.entries" data-key="id" responsive-layout="scroll" striped-rows>
            <Column header="Product" style="min-width: 200px">
              <template #body="{ data }">
                <div>
                  <div class="font-semibold">{{ data.product?.name || 'Unknown' }}</div>
                  <div class="text-sm text-500">{{ data.product?.barcode }}</div>
                </div>
              </template>
            </Column>

            <Column field="batch_number" header="Batch #" style="width: 150px"></Column>

            <Column header="Quantity" style="width: 120px">
              <template #body="{ data }">
                <div>
                  <div class="font-semibold">{{ data.quantity_received }}</div>
                  <div class="text-sm text-500">Remaining: {{ data.quantity_remaining }}</div>
                </div>
              </template>
            </Column>

            <Column field="cost_price" header="Cost Price" style="width: 120px">
              <template #body="{ data }">
                {{ formatCurrency(data.cost_price) }}
              </template>
            </Column>

            <Column field="selling_price" header="Selling Price" style="width: 120px">
              <template #body="{ data }">
                {{ formatCurrency(data.selling_price) }}
              </template>
            </Column>

            <Column header="Line Total" style="width: 120px">
              <template #body="{ data }">
                <span class="font-semibold">
                  {{ formatCurrency(data.cost_price * data.quantity_received) }}
                </span>
              </template>
            </Column>

            <Column field="expiry_date" header="Expiry Date" style="width: 120px">
              <template #body="{ data }">
                <span :class="getExpiryClass(data.expiry_date)">
                  {{ data.expiry_date ? formatDate(data.expiry_date) : '-' }}
                </span>
              </template>
            </Column>

            <Column field="notes" header="Notes" style="width: 150px">
              <template #body="{ data }">
                {{ data.notes || '-' }}
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">No products in this receipt</div>
            </template>
          </DataTable>
        </template>
      </Card>
    </div>

    <div v-else class="text-center py-8">
      <Message severity="error">Receipt not found</Message>
    </div>
  </div>
</template>

<script setup>
import { useStockReceiptStore } from '@/stores/stockReceipt';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const stockReceiptStore = useStockReceiptStore();

// State
const receipt = ref(null);
const loading = ref(false);

// Methods
const loadReceipt = async () => {
  try {
    loading.value = true;
    receipt.value = await stockReceiptStore.loadReceiptById(route.params.id);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load receipt details',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const editReceipt = () => {
  router.push(`/inventory/stock-receipts/${route.params.id}/edit`);
};

const goBack = () => {
  router.push('/inventory/stock-receipts');
};

const getStatusSeverity = (status) => {
  const severityMap = {
    draft: 'warning',
    completed: 'success',
    cancelled: 'danger',
  };
  return severityMap[status] || 'info';
};

const getExpiryClass = (expiryDate) => {
  if (!expiryDate) return '';

  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return 'text-danger font-semibold';
  if (daysUntilExpiry <= 30) return 'text-warning font-semibold';
  return '';
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return '-';
  return new Date(dateTime).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Lifecycle
onMounted(async () => {
  await loadReceipt();
});
</script>

<style scoped>
.view-stock-receipt {
  padding: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.field {
  margin-bottom: 0;
}
</style>
