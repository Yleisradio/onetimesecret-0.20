<script setup lang="ts">
import { computed } from 'vue';
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

const formatTTL = (seconds: number): string => {
  if (seconds >= 86400) return `${seconds / 86400} days`;
  if (seconds >= 3600) return `${seconds / 3600} hours`;
  return `${seconds / 60} minutes`;
};

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  // You might want to add a toast notification here
};
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-slate-800">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Link</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Security</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Expires</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Created</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="secret in secrets" :key="secret.id" class="hover:bg-gray-50 dark:hover:bg-slate-800/50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <span class="font-mono text-sm text-gray-900 dark:text-gray-100">{{ secret.url }}</span>
                <button
                  @click="copyToClipboard(secret.url)"
                  class="rounded p-1 hover:bg-gray-100 dark:hover:bg-slate-700"
                  title="Copy link">
                  <OIcon
                    collection="heroicons"
                    name="clipboard"
                    class="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1">
                <OIcon
                  v-if="secret.hasPassphrase"
                  collection="heroicons"
                  name="key"
                  class="h-4 w-4 text-amber-400" />
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ secret.hasPassphrase ? 'With passphrase' : 'No passphrase' }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {{ formatTTL(secret.ttl) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {{ formatDistanceToNow(secret.createdAt, { addSuffix: true }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
