<template>
  <div
    class="flex align-items-center justify-content-center"
    style="height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  >
    <Card style="width: 450px" class="shadow-8">
      <template #title>
        <div class="text-center">
          <i class="pi pi-shield text-6xl text-primary mb-3"></i>
          <h2 class="text-900 mb-2">Pharmacy POS</h2>
          <p class="text-600 text-sm">Sign in to continue</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin">
          <div class="field mb-4">
            <label for="username" class="block text-900 font-medium mb-2">Username</label>
            <InputText
              id="username"
              v-model="credentials.username"
              class="w-full"
              placeholder="Enter username"
              :class="{ 'p-invalid': errors.username }"
            />
            <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
          </div>

          <div class="field mb-4">
            <label for="password" class="block text-900 font-medium mb-2">Password</label>
            <Password
              id="password"
              v-model="credentials.password"
              class="w-full"
              placeholder="Enter password"
              :feedback="false"
              toggleMask
              :class="{ 'p-invalid': errors.password }"
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <Button
            type="submit"
            label="Sign In"
            icon="pi pi-sign-in"
            class="w-full"
            :loading="loading"
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
