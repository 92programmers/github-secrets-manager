<template>
  <main class="min-h-screen bg-[#1f2937]" :class="isDrawerOpen ? 'opacity-90' : ''">
    <section
      class="container mx-auto flex flex-col gap-4 pt-12 pb-6 sticky top-0 bg-[#1f2937] border-b bottom-2 border-gray-100"
    >
      <h1 class="text-3xl text-center text-white">Welcome</h1>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl text-white">Repositories</h1>
        <button
          class="rounded-lg bg-gray-200 px-4 py-2 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-blue-500 hover:text-white"
          :disabled="!selectedRepositories.length"
          @click="openDrawer"
        >
          Update Secret
        </button>
      </div>
    </section>
    <section class="container mx-auto py-6">
      <div v-if="loading.repos" class="mt-4 text-lg flex items-center justify-center text-gray-400">
        <div class="mr-2">Loading your repos. Please wait...</div>
        <LoadingSpinner />
      </div>
      <div v-else class="flex flex-col gapx-1 gap-y-5 w-full">
        <div v-for="(repositories, owner) in groupedByOwner" :key="owner" class="flex flex-col">
          <p
            class="py-2 ps-3 pe-8 flex items-center border-b border-gray-200 text-gray-900 text-sm bg-gray-100 w-fit rounded-t font-bold uppercase"
          >
            <img
              class="w-8 h-8 rounded-full object-cover mr-3"
              :src="repositories[0].owner.avatar_url"
              alt="organization avatar"
            />{{ owner }}
          </p>
          <div
            class="flex last:rounded-b cursor-pointer px-4 py-2 border-b border-gray-200"
            :class="isSelected(repo.id) ? 'bg-blue-100' : 'bg-gray-100'"
            v-for="(repo, index) in repositories"
            :key="repo.id"
            @click="handleClcik(repo)"
          >
            <div class="flex items-center mt-[10px] h-5">
              <p class="pr-2">{{ index + 1 }}:</p>
              <input
                :id="'repo-checkbox-' + repo.id"
                :value="repo"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                :checked="isSelected(repo.id)"
                @change="handleCheckboxChange($event, repo)"
              />
            </div>
            <div class="ms-2 mt-1 text-sm">
              <label for="helper-checkbox" class="font-medium text-lg text-gray-900">{{
                repo?.name
              }}</label>
              <p>
                Owner: <span class="text-xs font-normal text-gray-500">{{ repo.owner.login }}</span>
              </p>
              <p>
                URL:
                <a
                  id="helper-checkbox-text"
                  target="_blank"
                  :href="repo.html_url"
                  class="text-xs font-normal text-gray-500"
                  >{{ repo.html_url }}</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <DrawerModal
        title="Update Secret"
        :isOpen="isDrawerOpen"
        @update:isOpen="isDrawerOpen = $event"
      >
        <div class="mb-4">
          <label for="secretName" class="block text-sm font-medium text-white">Secret Name</label>
          <input
            v-model="secretName"
            type="text"
            id="secretName"
            name="secretName"
            class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div class="mb-4">
          <label for="secretValue" class="block text-sm font-medium text-white">Secret Value</label>
          <input
            v-model="secretValue"
            type="text"
            id="secretValue"
            name="secretValue"
            class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          class="rounded-lg w-full bg-gray-200 mt-6 px-4 py-2 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-blue-500 hover:text-white"
          :disabled="loading.secrets"
          @click="updateSecrets"
        >
          {{ loading.secrets ? 'Updating...' : 'Update' }}
        </button>
      </DrawerModal>
    </section>
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Octokit } from 'octokit'
import DrawerModal from '@/components/DrawerModal.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import sodium from 'libsodium-wrappers'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

interface Repo {
  id: number
  name: string
  html_url: string
  owner: {
    login: string
  }
}

const octokit = ref<any>(null)

const isDrawerOpen = ref(false)

const repositories = ref<Repo[]>([])
const selectedRepositories = ref<Repo[]>([])

const secretName = ref('')
const secretValue = ref('')

const loading = ref({
  repos: false,
  secrets: false
})

onMounted(async () => {
  const token = await getAccessToken()
  loading.value.repos = true
  octokit.value = new Octokit({ auth: token })
  await getRepos()
  getOrgs()
  loading.value.repos = false
})

const isSelected = (id: number) => !!selectedRepositories.value.find((repo) => repo.id === id)

const groupedByOwner = computed(() =>
  repositories.value.reduce((acc, obj) => {
    const ownerName = obj.owner.login
    if (!acc[ownerName]) {
      acc[ownerName] = []
    }
    acc[ownerName].push(obj)
    return acc
  }, {})
)

const handleCheckboxChange = (event: Event, repo: Repo) => {
  if ((event.target as HTMLInputElement).checked) {
    selectedRepositories.value.push(repo)
  } else {
    const index = selectedRepositories.value.findIndex(
      (selectedRepo) => selectedRepo.id === repo.id
    )
    if (index !== -1) {
      selectedRepositories.value.splice(index, 1)
    }
  }
}

const handleClcik = (repo: Repo) => {
  if (!isSelected(repo.id)) {
    selectedRepositories.value.push(repo)
  } else {
    const index = selectedRepositories.value.findIndex(
      (selectedRepo) => selectedRepo.id === repo.id
    )
    if (index !== -1) {
      selectedRepositories.value.splice(index, 1)
    }
  }
}

const openDrawer = () => {
  isDrawerOpen.value = true
}

const getAccessToken = async () => {
  const auth = localStorage.getItem('auth')
  const oldToken: { token: string } = auth && JSON.parse(auth)
  return oldToken.token
}

const getRepos = async () => {
  const result = await octokit.value.request('GET /user/repos', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  repositories.value = result.data
}

const getOrgs = async () => {
  const orgs = await octokit.value.request('GET /user/orgs', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  console.log(
    orgs.data,
    'Dont know why it does not return orgs data I have multiple orgs, You can check maybe it show orgs for your account.'
  )
}

const updateSecrets = async () => {
  if (!secretName.value || !secretValue.value) return
  try {
    loading.value.secrets = true
    for (let selectedRepo of selectedRepositories.value) {
      await createOrUpdateSecret(selectedRepo.owner.login, selectedRepo.name)
    }
    resetState()
    loading.value.secrets = false
    toast('Secrets updated successfully!', {
      autoClose: 1000,
      type: 'success',
      position: 'bottom-right'
    })
  } catch (error) {
    toast('Unable to update secrets!', {
      autoClose: 1000,
      type: 'error',
      position: 'bottom-right'
    })
  }
}

const createOrUpdateSecret = async (owner: string, repo: string) => {
  const key = await getKeyForRepo(owner, repo)
  const encrypted_value = encrypt(key.key, secretValue.value)
  await octokit.value.rest.actions.createOrUpdateRepoSecret({
    owner,
    repo,
    secret_name: secretName.value,
    encrypted_value,
    key_id: key.key_id
  })
}

const resetState = () => {
  isDrawerOpen.value = false
  selectedRepositories.value = []
  secretName.value = ''
  secretValue.value = ''
}

const getKeyForRepo = async (owner: string, repo: string) => {
  const { data: key } = await octokit.value.rest.actions.getRepoPublicKey({
    owner,
    repo
  })
  return key
}

const encrypt = (key: string, secret: string) => {
  const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
  const binsec = sodium.from_string(secret)

  const encBytes = sodium.crypto_box_seal(binsec, binkey)
  const output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)
  return output
}
</script>
