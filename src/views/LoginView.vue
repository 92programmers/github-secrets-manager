<template>
  <section class="h-screen bg-gray-100">
    <div class="container mx-auto h-full px-6 py-24">
      <div class="flex h-full flex-wrap items-center justify-center lg:justify-between">
        <!-- Left column container with background-->
        <div class="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            class="w-full"
            alt="Phone image"
          />
        </div>

        <!-- Right column container with form -->
        <div class="md:w-8/12 lg:ms-6 lg:w-5/12 h-full">
          <div class="flex flex-col justify-center h-full">
            <p class="text-gray-800 text-3xl font-bold h-20">{{ animatedText }}</p>
            <button
              @click="githubLogin"
              class="w-full lx tn yz ze zo adu alm are aru avz awf axu bbm bbs bbw bce big bpp flex justify-center items-center rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-200 hover:text-gray-800"
            >
              <svg class="nz sb aoi h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="ml-1 avz awf awo">GitHub Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { OAuthApp } from 'octokit'

const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID

onMounted(() => {
  animateText()
})

const app = new OAuthApp({
  clientId,
  clientSecret: '', // we dont need client secret on frontend
  defaultScopes: ['repo', 'gist', 'user', 'project', 'admin:org', 'orgs']
})

const githubLogin = () => {
  const flow = app.getWebFlowAuthorizationUrl({
    redirectUrl: `${location.origin}${import.meta.env.VITE_REDIRECT_URL}`
  })
  window.open(flow.url)
}

const text = 'Welcome back...'
const animatedText = ref('')

const animateText = () => {
  let index = 0
  const interval = setInterval(() => {
    animatedText.value += text[index]
    index++
    if (index === text.length) {
      clearInterval(interval)
    }
  }, 150) // Change the duration here (milliseconds)
}
</script>
<style></style>
