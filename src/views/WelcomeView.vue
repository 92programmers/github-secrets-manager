<template>
  <main class="min-h-screen container mx-auto flex flex-col gap-4 px-6 py-12">
    <h1 class="text-3xl text-center">Welcome</h1>
    <div class="mt-4 text-lg flex items-center justify-center text-gray-400">
      <div class="mr-2">Setting up your account. Please wait...</div>
      <LoadingSpinner />
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

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
    let oldToken = localStorage.getItem('auth')
    oldToken = oldToken && JSON.parse(oldToken)

    const token = await axios.post('http://localhost:3000/access-token', {
      code: route.query.code,
      state: route.query.code,
      accessToken: oldToken?.token
    })
    token?.data?.authentication &&
      localStorage.setItem('auth', JSON.stringify(token?.data?.authentication))
    router.push({ name: 'home' })
  } catch {
    router.push({ name: 'login' })
  }
}
</script>
