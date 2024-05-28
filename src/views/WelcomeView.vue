<template>
  <main class="h-screen bg-gray-100">
    <section class="container mx-auto flex flex-col gap-4 px-6 py-12">
      <h1 class="text-4xl text-center text-gray-800 drop-shadow-lg">Welcome</h1>
      <div class="mt-4 text-lg flex items-center justify-center text-gray-400">
        <div class="mr-2">Setting up your account. Please wait...</div>
        <LoadingSpinner />
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AuthService from '@/service/auth'

const route = useRoute()
const router = useRouter()

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await setupAccessToken()
  loading.value = false
})

const setupAccessToken = async () => {
  try {
    const authentication = await AuthService.getAccessToken(
      route?.query?.code?.toString() ?? '',
      route?.query?.state?.toString() ?? ''
    )
    authentication && localStorage.setItem('auth', JSON.stringify(authentication))
    router.push({ name: 'home' })
  } catch {
    router.push({ name: 'login' })
  }
}
</script>
