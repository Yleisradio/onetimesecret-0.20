<!-- src/components/secrets/form/SecretForm.vue -->

<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BasicFormAlerts from '@/components/BasicFormAlerts.vue';
import OIcon from '@/components/icons/OIcon.vue';
import SecretContentInputArea from './SecretContentInputArea.vue';
import { useSecretConcealer } from '@/composables/useSecretConcealer';
import { useDomainDropdown } from '@/composables/useDomainDropdown';
import { useProductIdentity } from '@/stores/identityStore';

export interface Props {
  enabled?: boolean;
  withRecipient?: boolean;
  withAsterisk?: boolean;
  withGenerate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  enabled: true,
  withRecipient: false,
  withAsterisk: false,
  withGenerate: false,
});

const router = useRouter();
const productIdentity = useProductIdentity();
const passphraseVisible = ref(false);
const mode = ref<'write' | 'preview'>('write');

const {
  form,
  validation,
  operations,
  isSubmitting,
  submit
} = useSecretConcealer({
  onSuccess: async (response) => {
    await router.push({
      name: 'Metadata link',
      params: { metadataKey: response.record.metadata.key }
    });
    operations.reset();
  }
});

const {
  availableDomains,
  selectedDomain,
  domainsEnabled,
  updateSelectedDomain
} = useDomainDropdown();

const hasContent = computed(() => form.secret.length > 0);
const expiryOptions = [
  { value: 7 * 24 * 3600, label: '7 days' },
  { value: 3 * 24 * 3600, label: '3 days' },
  { value: 24 * 3600, label: '1 day' },
  { value: 12 * 3600, label: '12 hours' },
  { value: 1 * 3600, label: '1 hour' }
];

// Form submission handlers
const handleConceal = () => submit('conceal');
const togglePassphraseVisibility = () => {
  passphraseVisible.value = !passphraseVisible.value;
};

// Watch for domain changes and update form
watch(selectedDomain, (domain) => {
  operations.updateField('share_domain', domain);
});

onMounted(() => {
  operations.updateField('share_domain', selectedDomain.value);
});
</script>

<template>
  <div class="min-w-[320px] max-w-3xl mx-auto space-y-6">
    <!-- Enhanced Alert Display -->
    <BasicFormAlerts
      :errors="Array.from(validation.errors.values())"
      class="sticky top-4 z-50"
    />

    <form @submit.prevent="handleConceal" class="space-y-6">
      <div class="rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-slate-900">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <OIcon collection="heroicons" name="shield-check" class="h-5 w-5 text-blue-500" />
            Secure Share
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">Preview</span>
        </div>

        <!-- Content Area -->
        <div class="p-4 space-y-4">
          <!-- Secret Input -->
          <SecretContentInputArea
            :content="form.secret"
            :disabled="isSubmitting"
            @update:content="(content) => operations.updateField('secret', content)"
          />

          <!-- Passphrase Field -->
          <div class="relative">
            <input
              :type="passphraseVisible ? 'text' : 'password'"
              v-model="form.passphrase"
              class="block w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm dark:border-gray-600"
              :placeholder="$t('web.secrets.enterPassphrase')"
            />
            <button
              type="button"
              @click="togglePassphraseVisibility"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <OIcon
                collection="heroicons"
                :name="passphraseVisible ? 'eye' : 'eye-off'"
                class="h-5 w-5"
              />
            </button>
          </div>

          <!-- Expiry Dropdown -->
          <div class="relative">
            <select
              v-model="form.ttl"
              class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-slate-800"
            >
              <option 
                v-for="option in expiryOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            @click="handleConceal"
            :disabled="!hasContent || isSubmitting"
            class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            Share Securely
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
