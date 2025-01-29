<!-- src/components/CustomDomainPreview.vue -->

<script setup lang="ts">
/**
 * CustomDomainPreview Component
 *
 * Technical Implementation:
 * - Uses composition API with dedicated composables:
 *   - useDropdown: Manages dropdown state and interactions
 *   - useDomainDropdown: Handles domain selection state
 *
 * Props:
 * @prop {string[]} [availableDomains] - List of available domains for selection
 * @prop {boolean} [withDomainDropdown=false] - Enable/disable domain selection
 *
 * Events:
 * @emits {string} update:selected-domain - Emitted when domain selection changes
 * @see {@link useDropdown} For dropdown behavior implementation
 * @see {@link useDomainDropdown} For domain selection implementation
 */
  import OIcon from '@/components/icons/OIcon.vue';
  import { useDomainDropdown } from '@/composables/useDomainDropdown';
  import { useDropdown } from '@/composables/useDropdown';

  withDefaults(
    defineProps<{
      availableDomains?: string[];
      initialDomain?: string;
      withDomainDropdown?: boolean;
    }>(),
    {
      initialDomain: '',
      withDomainDropdown: false,
    }
  );

  const emit = defineEmits<{
    'update:selected-domain': [domain: string];
  }>();

  const { close } = useDropdown();

  const { selectedDomain, updateSelectedDomain } = useDomainDropdown();

  const selectDomain = (domain: string) => {
    updateSelectedDomain(domain);
    emit('update:selected-domain', domain);
    close();
  };
</script>

<template>

  <div v-if="withDomainDropdown"
    :class="['rounded-lg transition-all duration-200 ease-in-out', 'mb-3 p-3 bg-white dark:bg-gray-800']">
    <div class="flex items-center space-x-2 text-slate-300">
      <OIcon
        collection="heroicons"
        name="globe-alt-solid"
        class="size-4 shrink-0" />
      <span class="font-mono text-sm text-slate-600 transition-colors duration-200 dark:text-slate-400">https://</span>
      <div class="relative inline-block">
        <select
          v-model="selectedDomain"
          class="appearance-none bg-transparent pr-6 font-mono text-sm text-slate-600  dark:text-slate-400 hover:text-brandcomp-500 cursor-pointer focus:outline-none">
          <option
            v-for="domain in availableDomains"
            :key="domain"
            :value="domain"
            @click.prevent="selectDomain(domain as string)"
            class="bg-slate-800 text-slate-100">
            {{ domain }}
          </option>
        </select>
      </div>
      <span class="font-mono text-sm truncate text-gray-600 transition-colors duration-200 dark:text-gray-400">
        /secret/<span class="blur-sm">000000000000000 &nbsp;&nbsp;</span>
      </span>
    </div>
  </div>

</template>

<style scoped>
  .relative {
  z-index: 50;
}
</style>
