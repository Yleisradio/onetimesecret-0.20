<script setup lang="ts">
import { ref } from 'vue';
import OIcon from '@/components/icons/OIcon.vue';
import { formatDistanceToNow } from 'date-fns';

interface SecretLink {
  id: string;
  url: string;
  hasPassphrase: boolean;
  ttl: number;
  createdAt: Date;
}

const props = defineProps<{
  secrets: SecretLink[];
}>();

// Copy functionality state
const copiedId = ref<string | null>(null);
const showToast = ref(false);

const formatTTL = (seconds: number): string => {
  if (seconds >= 86400) return `${Math.floor(seconds / 86400)} days`;
  if (seconds >= 3600) return `${Math.floor(seconds / 3600)} hours`;
  return `${Math.floor(seconds / 60)} minutes`;
};

const copyToClipboard = async (secret: SecretLink) => {
  try {
    await navigator.clipboard.writeText(secret.url);
    copiedId.value = secret.id;
    showToast.value = true;

    // Reset copy state
    setTimeout(() => {
      copiedId.value = null;
    }, 2000);

    // Hide toast
    setTimeout(() => {
      showToast.value = false;
    }, 1500);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
</script>

<template>
  <div class="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-slate-800">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Link</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Security</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Expires</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Created</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="secret in secrets"
            :key="secret.id"
            class="group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <span class="font-mono text-sm text-gray-900 dark:text-gray-100 truncate max-w-[300px]">
                  {{ secret.url }}
                </span>
                <button
                  @click="() => copyToClipboard(secret)"
                  class="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors duration-150"
                  :class="{ 'text-green-500 dark:text-green-400': copiedId === secret.id }"
                  :title="copiedId === secret.id ? 'Copied!' : 'Copy to clipboard'">
                  <OIcon
                    collection="material-symbols"
                    :name="copiedId === secret.id ? 'check' : 'content-copy-outline'"
                    class="w-4 h-4" />
                </button>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div
                  class="flex items-center gap-1.5 text-sm"
                  :class="secret.hasPassphrase ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'">
                  <OIcon
                    collection="material-symbols"
                    :name="secret.hasPassphrase ? 'key-vertical' : 'lock-open'"
                    class="w-4 h-4" />
                  <span>{{ secret.hasPassphrase ? 'Protected' : 'No passphrase' }}</span>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <OIcon
                  collection="material-symbols"
                  name="timer"
                  class="w-4 h-4" />
                {{ formatTTL(secret.ttl) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDistanceToNow(secret.createdAt, { addSuffix: true }) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Copy Feedback Toast -->
    <div
      v-if="showToast"
      class="absolute top-3 right-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-md shadow-lg transform transition-all duration-300"
      :class="{
        'opacity-0 translate-y-1': !showToast,
        'opacity-100 translate-y-0': showToast,
      }">
      Copied to clipboard
    </div>
  </div>
</template>
