<template>
  <div class="settings p-4">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="m-0 text-primary">Settings</h2>
      <p class="text-600 m-0 mt-1">Manage your account and application preferences</p>
    </div>

    <div class="grid">
      <!-- Change Password Section -->
      <div class="col-12 lg:col-8">
        <Card>
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-lock text-primary"></i>
              <span>Change Password</span>
            </div>
          </template>
          <template #content>
            <form @submit.prevent="handleChangePassword">
              <div class="field mb-4">
                <label for="currentPassword" class="block mb-2 font-medium">
                  Current Password *
                </label>
                <Password
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  :class="{ 'p-invalid': passwordErrors.currentPassword }"
                  toggleMask
                  :feedback="false"
                  placeholder="Enter current password"
                  class="w-full"
                  inputClass="w-full"
                />
                <small v-if="passwordErrors.currentPassword" class="p-error">
                  {{ passwordErrors.currentPassword }}
                </small>
              </div>

              <div class="field mb-4">
                <label for="newPassword" class="block mb-2 font-medium">New Password *</label>
                <Password
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  :class="{ 'p-invalid': passwordErrors.newPassword }"
                  toggleMask
                  :feedback="true"
                  placeholder="Enter new password"
                  class="w-full"
                  inputClass="w-full"
                >
                  <template #footer>
                    <Divider />
                    <p class="text-sm mb-2">Password Requirements:</p>
                    <ul class="pl-3 ml-2 text-sm line-height-3">
                      <li>At least 6 characters long</li>
                      <li>Different from current password</li>
                    </ul>
                  </template>
                </Password>
                <small v-if="passwordErrors.newPassword" class="p-error">
                  {{ passwordErrors.newPassword }}
                </small>
              </div>

              <div class="field mb-4">
                <label for="confirmPassword" class="block mb-2 font-medium">
                  Confirm New Password *
                </label>
                <Password
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  :class="{ 'p-invalid': passwordErrors.confirmPassword }"
                  toggleMask
                  :feedback="false"
                  placeholder="Confirm new password"
                  class="w-full"
                  inputClass="w-full"
                />
                <small v-if="passwordErrors.confirmPassword" class="p-error">
                  {{ passwordErrors.confirmPassword }}
                </small>
              </div>

              <div class="flex gap-2">
                <Button
                  type="submit"
                  label="Change Password"
                  icon="pi pi-check"
                  :loading="isChangingPassword"
                />
                <Button
                  type="button"
                  label="Clear"
                  icon="pi pi-times"
                  severity="secondary"
                  outlined
                  @click="clearPasswordForm"
                  :disabled="isChangingPassword"
                />
              </div>
            </form>
          </template>
        </Card>
      </div>

      <!-- User Information Section -->
      <div class="col-12 lg:col-4">
        <Card>
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              <span>User Information</span>
            </div>
          </template>
          <template #content>
            <div v-if="currentUser" class="flex flex-column gap-3">
              <div>
                <div class="text-500 text-sm mb-1">Full Name</div>
                <div class="font-semibold">{{ currentUser.full_name }}</div>
              </div>

              <Divider class="my-2" />

              <div>
                <div class="text-500 text-sm mb-1">Username</div>
                <div class="font-semibold">{{ currentUser.username }}</div>
              </div>

              <Divider class="my-2" />

              <div v-if="currentUser.email">
                <div class="text-500 text-sm mb-1">Email</div>
                <div class="font-semibold">{{ currentUser.email }}</div>
              </div>

              <Divider v-if="currentUser.email" class="my-2" />

              <div v-if="currentUser.phone">
                <div class="text-500 text-sm mb-1">Phone</div>
                <div class="font-semibold">{{ currentUser.phone }}</div>
              </div>

              <Divider v-if="currentUser.phone" class="my-2" />

              <div>
                <div class="text-500 text-sm mb-1">Status</div>
                <Tag
                  :value="currentUser.status"
                  :severity="currentUser.status === 'active' ? 'success' : 'danger'"
                  class="text-uppercase"
                />
              </div>
            </div>

            <div v-else class="text-center text-500 py-3">
              <i class="pi pi-user text-4xl mb-2"></i>
              <p>No user information available</p>
            </div>
          </template>
        </Card>

        <!-- Application Information -->
        <Card class="mt-3">
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-info-circle text-primary"></i>
              <span>Application Info</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div>
                <div class="text-500 text-sm mb-1">Application Name</div>
                <div class="font-semibold">Pharmacy POS System</div>
              </div>

              <Divider class="my-2" />

              <div>
                <div class="text-500 text-sm mb-1">Version</div>
                <div class="font-semibold">1.0.0</div>
              </div>

              <Divider class="my-2" />

              <div>
                <div class="text-500 text-sm mb-1">Environment</div>
                <Tag value="PRODUCTION" severity="success" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Database Backup Section -->
    <div class="mt-4">
      <Card>
        <template #title>
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-database text-primary"></i>
              <span>Database Backup</span>
            </div>
            <Button
              label="Create New Backup"
              icon="pi pi-plus"
              @click="handleCreateBackup"
              :loading="isCreatingBackup"
              size="small"
            />
          </div>
        </template>
        <template #content>
          <div v-if="isLoadingBackups" class="text-center py-4">
            <ProgressSpinner style="width: 50px; height: 50px" />
            <p class="text-600 mt-2">Loading backups...</p>
          </div>

          <div v-else-if="backups.length === 0" class="text-center py-6">
            <i class="pi pi-database text-6xl text-400 mb-3"></i>
            <p class="text-xl text-600 mb-2">No backups found</p>
            <p class="text-500 mb-4">Create your first database backup to get started</p>
            <Button
              label="Create Backup"
              icon="pi pi-plus"
              @click="handleCreateBackup"
              :loading="isCreatingBackup"
            />
          </div>

          <DataTable v-else :value="backups" class="p-datatable-sm" responsiveLayout="scroll">
            <Column field="fileName" header="File Name" style="min-width: 300px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-file text-primary"></i>
                  <span class="font-semibold">{{ data.fileName }}</span>
                </div>
              </template>
            </Column>

            <Column field="fileSize" header="Size" style="min-width: 100px">
              <template #body="{ data }">
                <Tag :value="data.fileSize" severity="info" />
              </template>
            </Column>

            <Column field="createdAt" header="Created Date" style="min-width: 180px">
              <template #body="{ data }">
                {{ formatDate(data.createdAt) }}
              </template>
            </Column>

            <Column header="Actions" style="min-width: 180px">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <Button
                    icon="pi pi-download"
                    severity="success"
                    size="small"
                    @click="handleDownloadBackup(data.fileName)"
                    v-tooltip.top="'Download'"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    @click="confirmDeleteBackup(data)"
                    v-tooltip.top="'Delete'"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- Future Features Placeholder -->
    <div class="mt-4">
      <Card>
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-cog text-primary"></i>
            <span>Additional Settings</span>
          </div>
        </template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-4">
              <div
                class="p-3 surface-100 border-round text-center cursor-pointer hover:surface-200 transition-colors transition-duration-200"
                @click="$router.push('/export')"
              >
                <i class="pi pi-download text-4xl text-primary mb-2"></i>
                <div class="font-semibold mb-1">Data Export</div>
                <small class="text-600">Export sales & inventory data</small>
              </div>
            </div>

            <div class="col-12 md:col-6 lg:col-4">
              <div
                class="p-3 surface-100 border-round text-center cursor-pointer hover:surface-200 transition-colors transition-duration-200"
                @click="showNotificationSettings = true"
              >
                <i class="pi pi-bell text-4xl text-blue-500 mb-2"></i>
                <div class="font-semibold mb-1">Notifications</div>
                <small class="text-600">Configure notification preferences</small>
              </div>
            </div>

            <div class="col-12 md:col-6 lg:col-4">
              <div class="p-3 surface-100 border-round text-center">
                <i class="pi pi-palette text-4xl text-500 mb-2"></i>
                <div class="font-semibold mb-1 text-600">Appearance</div>
                <small class="text-500">Coming Soon</small>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Notification Preferences Modal -->
    <NotificationPreferencesModal
      v-model:visible="showNotificationSettings"
      @saved="handleNotificationsSaved"
    />
  </div>
</template>

<script setup>
import NotificationPreferencesModal from '@/components/notifications/NotificationPreferencesModal.vue';
import { AuthService } from '@/services/AuthService';
import BackupService from '@/services/BackupService';
import { useAuthStore } from '@/stores/auth';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const confirm = useConfirm();
const authStore = useAuthStore();

// State
const currentUser = ref(null);
const isChangingPassword = ref(false);
const backups = ref([]);
const isLoadingBackups = ref(false);
const isCreatingBackup = ref(false);
const showNotificationSettings = ref(false);

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const passwordErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Methods
onMounted(async () => {
  await loadCurrentUser();
  await loadBackups();
});

async function loadCurrentUser() {
  try {
    const result = await AuthService.getCurrentUser();
    if (result.success) {
      currentUser.value = result.user;
    } else {
      // Fallback to auth store
      currentUser.value = authStore.user;
    }
  } catch (error) {
    console.error('Error loading user:', error);
    // Fallback to auth store
    currentUser.value = authStore.user;
  }
}

async function loadBackups() {
  isLoadingBackups.value = true;
  try {
    const result = await BackupService.listBackups();
    if (result.success) {
      backups.value = result.data;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error loading backups:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load backups',
      life: 3000,
    });
  } finally {
    isLoadingBackups.value = false;
  }
}

async function handleCreateBackup() {
  isCreatingBackup.value = true;
  try {
    const result = await BackupService.createBackup();
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Database backup created successfully',
        life: 3000,
      });
      await loadBackups();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error creating backup:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create backup',
      life: 3000,
    });
  } finally {
    isCreatingBackup.value = false;
  }
}

async function handleDownloadBackup(fileName) {
  try {
    const result = await BackupService.downloadBackup(fileName);
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Backup downloaded successfully',
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error downloading backup:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to download backup',
      life: 3000,
    });
  }
}

function confirmDeleteBackup(backup) {
  confirm.require({
    message: `Are you sure you want to delete backup "${backup.fileName}"? This action cannot be undone.`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => handleDeleteBackup(backup.fileName),
  });
}

async function handleDeleteBackup(fileName) {
  try {
    const result = await BackupService.deleteBackup(fileName);
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Backup deleted successfully',
        life: 3000,
      });
      await loadBackups();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error deleting backup:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete backup',
      life: 3000,
    });
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function validatePasswordForm() {
  passwordErrors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  let isValid = true;

  // Validate current password
  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required';
    isValid = false;
  }

  // Validate new password
  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'New password is required';
    isValid = false;
  } else if (passwordForm.value.newPassword.length < 6) {
    passwordErrors.value.newPassword = 'Password must be at least 6 characters';
    isValid = false;
  } else if (passwordForm.value.newPassword === passwordForm.value.currentPassword) {
    passwordErrors.value.newPassword = 'New password must be different from current password';
    isValid = false;
  }

  // Validate confirm password
  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Please confirm your new password';
    isValid = false;
  } else if (passwordForm.value.confirmPassword !== passwordForm.value.newPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return isValid;
}

async function handleChangePassword() {
  if (!validatePasswordForm()) {
    return;
  }

  isChangingPassword.value = true;

  try {
    const result = await AuthService.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Password changed successfully',
        life: 3000,
      });
      clearPasswordForm();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.message || 'Failed to change password',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to change password',
      life: 3000,
    });
  } finally {
    isChangingPassword.value = false;
  }
}

function clearPasswordForm() {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  passwordErrors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
}

function handleNotificationsSaved() {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Notification preferences saved successfully',
    life: 3000,
  });
}
</script>

<style scoped>
.settings {
  max-width: 1400px;
  margin: 0 auto;
}

.field label {
  color: var(--text-color);
}
</style>
