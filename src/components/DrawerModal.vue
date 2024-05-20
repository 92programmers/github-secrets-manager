<template>
  <div
    :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }"
    class="fixed inset-y-0 right-0 z-50 w-[30rem] bg-white shadow-lg overflow-y-auto transition-transform duration-300"
  >
    <div class="flex items-center justify-between px-4 py-3 border-b">
      <h2 class="text-lg font-semibold">{{ title }}</h2>
      <button @click="closeDrawer" class="text-gray-500 hover:text-gray-700 focus:outline-none">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div class="px-4 py-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Drawer'
  }
})
const emit = defineEmits(['update:isOpen'])
const closeDrawer = () => {
  emit('update:isOpen', false)
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
