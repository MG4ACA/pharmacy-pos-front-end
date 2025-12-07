<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="'Notification Settings'"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="handleClose"
  >
    <div v-if="isLoading" class="flex align-items-center justify-content-center p-5">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <div v-else class="flex flex-column gap-4">
      <!-- Low Stock Alerts -->
      <Card>
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-exclamation-triangle text-orange-500"></i>
            <span class="text-lg">Low Stock Alerts</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center justify-content-between">
              <label for="lowStockEnabled" class="font-medium">Enable Alerts</label>
              <InputSwitch id="lowStockEnabled" v-model="formData.low_stock_enabled" />
            </div>

            <div v-if="formData.low_stock_enabled" class="flex flex-column gap-3 ml-4">
              <div class="field mb-0">
                <label for="lowStockThreshold" class="block mb-2">Alert Threshold (units)</label>
                <InputNumber
                  id="lowStockThreshold"
                  v-model="formData.low_stock_threshold"
                  :min="1"
                  :max="1000"
                  showButtons
                  class="w-full"
                />
                <small class="text-600">Alert when stock level falls below this number</small>
              </div>

              <div class="field mb-0">
                <label for="lowStockFrequency" class="block mb-2">Notification Frequency</label>
                <Dropdown
                  id="lowStockFrequency"
                  v-model="formData.low_stock_frequency"
                  :options="frequencyOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Expiring Products Alerts -->
      <Card>
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-calendar-times text-red-500"></i>
            <span class="text-lg">Expiring Products Alerts</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center justify-content-between">
              <label for="expiringEnabled" class="font-medium">Enable Alerts</label>
              <InputSwitch id="expiringEnabled" v-model="formData.expiring_products_enabled" />
            </div>

            <div v-if="formData.expiring_products_enabled" class="flex flex-column gap-3 ml-4">
              <div class="field mb-0">
                <label for="expiringDays" class="block mb-2">Alert Days Before Expiry</label>
                <InputNumber
                  id="expiringDays"
                  v-model="formData.expiring_products_days"
                  :min="1"
                  :max="365"
                  showButtons
                  class="w-full"
                />
                <small class="text-600">
                  Alert when products are expiring within this many days
                </small>
              </div>

              <div class="field mb-0">
                <label for="expiringFrequency" class="block mb-2">Notification Frequency</label>
                <Dropdown
                  id="expiringFrequency"
                  v-model="formData.expiring_products_frequency"
                  :options="frequencyOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Daily Sales Summary -->
      <Card>
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-chart-line text-blue-500"></i>
            <span class="text-lg">Daily Sales Summary</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center justify-content-between">
              <label for="dailySalesEnabled" class="font-medium">Enable Summary</label>
              <InputSwitch id="dailySalesEnabled" v-model="formData.daily_sales_enabled" />
            </div>

            <div v-if="formData.daily_sales_enabled" class="field mb-0 ml-4">
              <label for="dailySalesTime" class="block mb-2">Delivery Time</label>
              <Calendar
                id="dailySalesTime"
                v-model="dailySalesTime"
                timeOnly
                hourFormat="24"
                showIcon
                class="w-full"
              />
              <small class="text-600">Time when daily sales summary will be generated</small>
            </div>
          </div>
        </template>
      </Card>

      <!-- System Updates -->
      <Card>
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-sync text-purple-500"></i>
            <span class="text-lg">System Updates</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center justify-content-between">
              <label for="systemUpdatesEnabled" class="font-medium">Enable Notifications</label>
              <InputSwitch id="systemUpdatesEnabled" v-model="formData.system_updates_enabled" />
            </div>

            <div v-if="formData.system_updates_enabled" class="field mb-0 ml-4">
              <label for="systemUpdatesFrequency" class="block mb-2">Notification Frequency</label>
              <Dropdown
                id="systemUpdatesFrequency"
                v-model="formData.system_updates_frequency"
                :options="frequencyOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Payment Reminders -->
      <Card>
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-money-bill text-green-500"></i>
            <span class="text-lg">Payment Reminders</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center justify-content-between">
              <label for="paymentRemindersEnabled" class="font-medium">Enable Reminders</label>
              <InputSwitch
                id="paymentRemindersEnabled"
                v-model="formData.payment_reminders_enabled"
              />
            </div>

            <div v-if="formData.payment_reminders_enabled" class="field mb-0 ml-4">
              <label for="paymentRemindersFrequency" class="block mb-2">
                Notification Frequency
              </label>
              <Dropdown
                id="paymentRemindersFrequency"
                v-model="formData.payment_reminders_frequency"
                :options="frequencyOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button label="Cancel" severity="secondary" @click="handleClose" :disabled="isSaving" />
        <Button
          label="Save Changes"
          icon="pi pi-check"
          @click="handleSave"
          :loading="isSaving"
          :disabled="isLoading"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'saved']);

const toast = useToast();
const notificationStore = useNotificationStore();

// State
const isLoading = ref(false);
const isSaving = ref(false);

const formData = ref({
  low_stock_enabled: true,
  low_stock_threshold: 10,
  low_stock_frequency: 'realtime',
  expiring_products_enabled: true,
  expiring_products_days: 30,
  expiring_products_frequency: 'daily',
  daily_sales_enabled: true,
  daily_sales_time: '23:00:00',
  system_updates_enabled: true,
  system_updates_frequency: 'realtime',
  payment_reminders_enabled: false,
  payment_reminders_frequency: 'daily',
});

const dailySalesTime = ref(new Date());

const frequencyOptions = [
  { label: 'Real-time', value: 'realtime' },
  { label: 'Daily Digest', value: 'daily' },
  { label: 'Weekly Digest', value: 'weekly' },
];

// Computed
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

// Watch for time changes
watch(dailySalesTime, (newTime) => {
  if (newTime) {
    const hours = String(newTime.getHours()).padStart(2, '0');
    const minutes = String(newTime.getMinutes()).padStart(2, '0');
    formData.value.daily_sales_time = `${hours}:${minutes}:00`;
  }
});

// Watch for dialog open
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      loadPreferences();
    }
  }
);

// Methods
onMounted(() => {
  if (props.visible) {
    loadPreferences();
  }
});

async function loadPreferences() {
  try {
    isLoading.value = true;
    await notificationStore.loadPreferences();

    if (notificationStore.preferences) {
      const prefs = notificationStore.preferences;
      formData.value = {
        low_stock_enabled: prefs.low_stock_enabled,
        low_stock_threshold: prefs.low_stock_threshold,
        low_stock_frequency: prefs.low_stock_frequency,
        expiring_products_enabled: prefs.expiring_products_enabled,
        expiring_products_days: prefs.expiring_products_days,
        expiring_products_frequency: prefs.expiring_products_frequency,
        daily_sales_enabled: prefs.daily_sales_enabled,
        daily_sales_time: prefs.daily_sales_time,
        system_updates_enabled: prefs.system_updates_enabled,
        system_updates_frequency: prefs.system_updates_frequency,
        payment_reminders_enabled: prefs.payment_reminders_enabled,
        payment_reminders_frequency: prefs.payment_reminders_frequency,
      };

      // Parse time
      if (prefs.daily_sales_time) {
        const [hours, minutes] = prefs.daily_sales_time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        dailySalesTime.value = date;
      }
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load notification preferences',
      life: 5000,
    });
  } finally {
    isLoading.value = false;
  }
}

async function handleSave() {
  try {
    isSaving.value = true;

    await notificationStore.updatePreferences(formData.value);

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Notification preferences updated successfully',
      life: 3000,
    });

    emit('saved');
    handleClose();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update notification preferences',
      life: 5000,
    });
  } finally {
    isSaving.value = false;
  }
}

function handleClose() {
  visible.value = false;
}
</script>
