<template>
  <div class="layout-wrapper">
    <Navbar />
    <Sidebar />
    <div class="layout-main">
      <div class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-main {
  display: flex;
  flex: 1;
  margin-top: var(--navbar-height);
  overflow: hidden;
}

.layout-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 0 2rem;
  overflow-y: auto;
  background-color: var(--surface-ground);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
