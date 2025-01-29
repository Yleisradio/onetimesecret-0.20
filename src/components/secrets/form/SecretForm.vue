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
import CustomDomainPreview from './../../CustomDomainPreview.vue';

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
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-slate-900">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <OIcon collection="heroicons" name="lock-closed" class="h-5 w-5 text-blue-500" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Prepare Message
            </h2>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ mode === 'write' ? 'Compose' : 'Preview' }}
            </span>
            <button
              type="button"
              @click="mode = mode === 'write' ? 'preview' : 'write'"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <OIcon collection="heroicons" :name="mode === 'write' ? 'solid-eye' : 'pencil-square'" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-6 space-y-6">
          <!-- Secret Input -->
          <SecretContentInputArea
            v-model:content="form.secret"
            :disabled="isSubmitting"
            @update:content="(content) => operations.updateField('secret', content)"
          />

          <div class="grid gap-6 md:grid-cols-2">
            <!-- Passphrase Field -->
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <OIcon collection="heroicons" name="key" class="h-4 w-4 text-gray-400" />
              </div>
              <input
                :type="passphraseVisible ? 'text' : 'password'"
                v-model="form.passphrase"
                class="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
                :placeholder="$t('web.secrets.enterPassphrase')"
              />
              <button
                type="button"
                @click="togglePassphraseVisibility"
                class="absolute inset-y-0 right-3 flex items-center"
              >
                <OIcon
                  collection="heroicons"
                  :name="passphraseVisible ? 'solid-eye' : 'outline-eye-off'"
                  class="h-4 w-4 text-gray-400 hover:text-gray-600"
                />
              </button>
            </div>

            <!-- Expiry Selection -->
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <OIcon collection="heroicons" name="fire" class="h-4 w-4 text-gray-400" />
              </div>
              <select
                v-model="form.ttl"
                class="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
              >
                <option
                  v-for="option in expiryOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <OIcon collection="heroicons" name="chevron-down" class="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-900/20">
            <OIcon collection="heroicons" name="information-circle" class="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
            <p class="text-blue-700 dark:text-blue-300">
              This message will self-destruct after being viewed. The link can only be accessed once.
            </p>
          </div>

          <CustomDomainPreview v-if="productIdentity.isCanonical"
                                            :available-domains="availableDomains"
                                            :with-domain-dropdown="domainsEnabled"
                                            @update:selected-domain="updateSelectedDomain" />
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            type="submit"
            :disabled="!hasContent || isSubmitting"
            class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
          >
            <span class="flex items-center gap-2">
              <OIcon collection="heroicons" name="check-circle" class="h-4 w-4" />
              Create Link
            </span>
          </button>
        </div>
      </div>
    </form>


  </div>
</template>
