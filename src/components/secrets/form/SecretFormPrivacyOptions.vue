// src/components/secrets/form/SecretFormPrivacyOptions.vue

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { usePrivacyOptions } from '@/composables/usePrivacyOptions';
import type { SecretFormData } from '@/composables/useSecretForm';

interface Props {
  form: SecretFormData;
  validation: {
    errors: Map<keyof SecretFormData, string>;
  };
  operations: {
    updateField: <K extends keyof SecretFormData>(field: K, value: SecretFormData[K]) => void;
  };
  disabled?: boolean;
  withRecipient?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  withRecipient: false,
});

const { t } = useI18n();

const {
  state,
  updateRecipient,
} = usePrivacyOptions(props.operations);

const getError = (field: keyof SecretFormData) => props.validation.errors.get(field);
</script>

<template>
  <!-- Recipient Field -->
  <div v-if="withRecipient" class="mt-4">
    <input
      :value="form.recipient"
      :disabled="disabled"
      type="email"
      id="recipient"
      name="recipient"
      placeholder="recipient@example.com"
      class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
      @input="(e) => updateRecipient((e.target as HTMLInputElement).value)"
    />
    <p v-if="getError('recipient')" class="mt-1 text-sm text-red-500">
      {{ getError('recipient') }}
    </p>
  </div>
</template>
