<template>
  <div class="mobile-more p-3 pb-8">
    <div class="flex align-items-center mb-4">
      <Button
        v-if="selectedInsight"
        icon="pi pi-chevron-left"
        text
        rounded
        @click="selectedInsight = null"
        class="mr-2"
      />
      <h1 class="text-2xl font-bold m-0">
        {{ selectedInsight ? selectedInsight.title : 'More Insights' }}
      </h1>
    </div>

    <!-- Insight Menu (Grid of Cards) -->
    <div v-if="!selectedInsight" class="grid">
      <div v-for="item in insightMenu" :key="item.id" class="col-6">
        <Card
          class="h-full cursor-pointer hover:surface-100 shadow-1"
          @click="selectedInsight = item"
        >
          <template #content>
            <div class="flex flex-column align-items-center justify-content-center py-3">
              <div
                class="w-3rem h-3rem border-round flex align-items-center justify-content-center mb-3"
                :class="item.bgClass"
              >
                <i :class="[item.icon, item.iconClass, 'text-2xl']"></i>
              </div>
              <span class="font-bold text-center text-sm">{{ item.title }}</span>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Insight Details -->
    <div v-else class="insight-detail">
      <!-- Top Selling Products -->
      <Card v-if="selectedInsight.id === 'top-selling'" class="shadow-1">
        <template #content>
          <div v-if="!isLoading">
            <div
              v-for="(item, index) in topProducts"
              :key="item.product_id"
              class="flex align-items-center justify-content-between py-3 border-bottom-1 border-100"
            >
              <div class="flex align-items-center">
                <span class="text-500 mr-3 font-bold">{{ index + 1 }}</span>
                <div class="flex flex-column">
                  <span class="font-semibold">{{ item.product?.name }}</span>
                  <span class="text-500 text-xs">{{ item.total_quantity }} units sold</span>
                </div>
              </div>
              <span class="font-bold text-blue-600">
                LKR {{ formatCurrency(item.total_revenue) }}
              </span>
            </div>
          </div>
          <div v-else class="flex flex-column gap-3">
            <Skeleton v-for="i in 5" :key="i" height="3rem" />
          </div>
        </template>
      </Card>

      <!-- Free Items Summary -->
      <Card v-if="selectedInsight.id === 'free-items'" class="shadow-1">
        <template #content>
          <div v-if="!isLoading" class="grid">
            <div class="col-6">
              <div class="p-3 bg-purple-50 border-round text-center">
                <div class="text-500 text-xs mb-1">Received</div>
                <div class="text-xl font-bold text-purple-700">
                  {{ freeItems.month?.received || 0 }}
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="p-3 bg-green-50 border-round text-center">
                <div class="text-500 text-xs mb-1">Sold</div>
                <div class="text-xl font-bold text-green-700">{{ freeItems.month?.sold || 0 }}</div>
              </div>
            </div>
            <div class="col-12 mt-2">
              <div
                class="p-3 bg-blue-50 border-round flex justify-content-between align-items-center"
              >
                <span class="text-500 text-sm">Potential Revenue</span>
                <span class="text-lg font-bold text-blue-700">
                  LKR {{ formatCurrency(freeItems.month?.revenue || 0) }}
                </span>
              </div>
            </div>
          </div>
          <Skeleton v-else height="120px" />
        </template>
      </Card>

      <!-- Movement Speed -->
      <Card v-if="selectedInsight.id === 'movement'" class="shadow-1">
        <template #content>
          <div v-if="!isLoading">
            <div v-for="item in topProducts" :key="'speed-' + item.product_id" class="mb-4">
              <div class="flex justify-content-between mb-1">
                <span class="font-semibold">{{ item.product?.name }}</span>
                <span class="text-green-600 font-bold">Fast</span>
              </div>
              <ProgressBar
                :value="Math.min(100, (item.total_quantity / 50) * 100)"
                :showValue="false"
                style="height: 8px"
              />
              <div class="text-xs text-500 mt-1">{{ item.total_quantity }} units sold recently</div>
            </div>
          </div>
          <div v-else class="flex flex-column gap-4">
            <Skeleton v-for="i in 4" :key="i" height="4rem" />
          </div>
        </template>
      </Card>

      <!-- Suppliers -->
      <Card v-if="selectedInsight.id === 'suppliers'" class="shadow-1">
        <template #content>
          <div v-if="!isLoading" class="supplier-list">
            <div
              v-for="supplier in suppliers"
              :key="supplier.id"
              class="flex flex-column py-3 border-bottom-1 border-100"
            >
              <div class="flex justify-content-between align-items-start">
                <span class="font-bold text-lg">{{ supplier.name }}</span>
                <Tag :value="supplier.phone" severity="info" class="text-xs" />
              </div>
              <div class="text-500 text-sm mt-1">{{ supplier.address }}</div>
              <div class="flex align-items-center mt-2 text-600 text-sm">
                <i class="pi pi-user mr-2"></i>
                <span>{{ supplier.contact_person || 'No contact person' }}</span>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-column gap-3">
            <Skeleton v-for="i in 5" :key="i" height="4rem" />
          </div>
        </template>
      </Card>

      <!-- Peak Hours -->
      <Card v-if="selectedInsight.id === 'peak-hours'" class="shadow-1">
        <template #content>
          <div style="height: 300px">
            <Chart type="bar" :data="peakHoursData" :options="peakHoursOptions" />
          </div>
          <div class="mt-4 p-3 surface-100 border-round">
            <div class="flex align-items-center mb-2">
              <i class="pi pi-info-circle text-blue-500 mr-2"></i>
              <span class="font-bold">Insight</span>
            </div>
            <p class="m-0 text-sm text-600 line-height-3">
              Your busiest hours are between 4 PM and 8 PM. Consider having more staff available
              during this period to handle the increased customer flow.
            </p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import DashboardService from '@/services/DashboardService';
import ReportService from '@/services/ReportService';
import { SupplierService } from '@/services/SupplierService';
import { onMounted, ref } from 'vue';

const isLoading = ref(true);
const suppliers = ref([]);
const topProducts = ref([]);
const freeItems = ref({});
const selectedInsight = ref(null);

const insightMenu = [
  {
    id: 'top-selling',
    title: 'Top Selling',
    icon: 'pi pi-star-fill',
    iconClass: 'text-yellow-500',
    bgClass: 'bg-yellow-50',
  },
  {
    id: 'free-items',
    title: 'Free Items',
    icon: 'pi pi-gift',
    iconClass: 'text-purple-500',
    bgClass: 'bg-purple-50',
  },
  {
    id: 'movement',
    title: 'Movement',
    icon: 'pi pi-bolt',
    iconClass: 'text-green-500',
    bgClass: 'bg-green-50',
  },
  {
    id: 'suppliers',
    title: 'Suppliers',
    icon: 'pi pi-users',
    iconClass: 'text-orange-500',
    bgClass: 'bg-orange-50',
  },
  {
    id: 'peak-hours',
    title: 'Peak Hours',
    icon: 'pi pi-clock',
    iconClass: 'text-indigo-500',
    bgClass: 'bg-indigo-50',
  },
];

const peakHoursData = ref({
  labels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
  datasets: [
    {
      label: 'Sales Volume',
      backgroundColor: '#6366F1',
      data: [12, 25, 45, 30, 55, 80, 40],
    },
  ],
});

const peakHoursOptions = ref({
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [supplierRes, topProductsRes, summaryRes] = await Promise.all([
      SupplierService.getAllSuppliers(),
      ReportService.getTopSellingProducts({ limit: 10 }),
      DashboardService.getDashboardSummary(),
    ]);

    if (supplierRes.success) suppliers.value = supplierRes.data;
    if (topProductsRes.success) topProducts.value = topProductsRes.data;
    if (summaryRes.success) freeItems.value = summaryRes.data.freeItems;
  } catch (error) {
    console.error('Error fetching more insights:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.mobile-more {
  background-color: #f8fafc;
}
.pb-8 {
  padding-bottom: 5rem;
}
.insight-detail {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
