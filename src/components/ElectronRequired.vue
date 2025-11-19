<template>
  <div class="electron-required">
    <Card class="error-card">
      <template #header>
        <div class="error-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
      </template>
      <template #title>
        <h2>Electron Environment Required</h2>
      </template>
      <template #content>
        <p class="error-message">
          This application must be run inside Electron, not in a regular web browser.
        </p>
        <div class="instructions">
          <h3>To run the application:</h3>
          <ol>
            <li>Open a terminal in the project directory</li>
            <li>
              Run the command:
              <code>npm run electron:dev</code>
            </li>
            <li>The application will open in an Electron window</li>
          </ol>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
</script>

<style scoped>
.electron-required {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.error-card {
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.error-icon {
  text-align: center;
  padding: 2rem 0 1rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.error-icon i {
  font-size: 4rem;
  color: white;
}

.error-card :deep(.p-card-title) {
  text-align: center;
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-message {
  text-align: center;
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 2rem;
}

.instructions {
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.instructions h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1f2937;
  font-size: 1rem;
}

.instructions ol {
  margin: 0;
  padding-left: 1.5rem;
}

.instructions li {
  margin-bottom: 0.75rem;
  color: #4b5563;
}

.instructions code {
  background: #1f2937;
  color: #10b981;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}
</style>
