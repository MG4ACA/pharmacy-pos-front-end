<template>
  <div class="login-container">
    <Card class="login-card">
      <template #title>
        <div class="login-header">
          <i class="pi pi-shield"></i>
          <h2>Pharmacy POS</h2>
          <p>Sign in to continue</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="field">
            <label for="username">Username</label>
            <InputText
              id="username"
              v-model="credentials.username"
              placeholder="Enter username"
              :class="{ 'p-invalid': errors.username }"
            />
            <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
          </div>

          <div class="field">
            <label for="password">Password</label>
            <Password
              id="password"
              v-model="credentials.password"
              placeholder="Enter password"
              :feedback="false"
              toggleMask
              :input-class="{ 'p-invalid': errors.password }"
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <div class="flex gap-2">
            <Button
              type="button"
              label="Fill Demo Login"
              icon="pi pi-user"
              class="p-button-secondary p-button-sm"
              @click="fillDemoCredentials"
            />
          </div>

          <Button
            type="submit"
            label="Sign In"
            icon="pi pi-sign-in"
            :loading="loading"
            class="mt-3"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useToast } from 'primevue/usetoast';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const credentials = reactive({
  username: '',
  password: '',
});

const errors = reactive({
  username: '',
  password: '',
});

const loading = ref(false);

const fillDemoCredentials = () => {
  credentials.username = 'admin';
  credentials.password = 'admin123';
  errors.username = '';
  errors.password = '';
};

const validateForm = () => {
  let isValid = true;
  errors.username = '';
  errors.password = '';

  if (!credentials.username.trim()) {
    errors.username = 'Username is required';
    isValid = false;
  }

  if (!credentials.password) {
    errors.password = 'Password is required';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  loading.value = true;
  try {
    await authStore.login(credentials);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Logged in successfully',
      life: 3000,
    });
    router.push('/dashboard');
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: error.message || 'Invalid credentials',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-card :deep(.p-card-body) {
  padding: 2rem 2.5rem;
}

.login-card :deep(.p-card-title) {
  padding: 0;
  margin-bottom: 0;
}

.login-card :deep(.p-card-content) {
  padding: 0;
}

.login-header {
  text-align: center;
  padding: 0;
  margin-bottom: 1.5rem;
}

.login-header i {
  font-size: 3.5rem;
  color: #3b82f6;
  margin-bottom: 1rem;
  display: block;
}

.login-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.login-header p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.login-form {
  padding-top: 0.5rem;
}

.login-form .field {
  margin-bottom: 1.5rem;
}

.login-form .field:last-of-type {
  margin-bottom: 2rem;
}

.login-form label {
  display: block;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
}

.login-form .p-inputtext,
.login-form :deep(.p-password input) {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
}

.login-form .p-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
}

.login-form .p-error {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}
</style>
