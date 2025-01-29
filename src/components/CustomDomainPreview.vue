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
  import { onClickOutside } from '@vueuse/core';
  import { watch } from 'vue';

  const props = withDefaults(
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

  const { isOpen, dropdownRef, close } = useDropdown();
  const { selectedDomain, updateSelectedDomain, isLoading } = useDomainDropdown();

  onClickOutside(dropdownRef, () => {
    close();
  });

  const selectDomain = (domain: string) => {
    updateSelectedDomain(domain);
    emit('update:selected-domain', domain);
    close();
  };

  // Watch for changes in availableDomains to simulate loading state
  watch(() => props.availableDomains, (newDomains) => {
    if (!newDomains) {
      isLoading.value = true;
    } else {
      isLoading.value = false;
    }
  }, { immediate: true });
</script>

<template>
  <div
    v-if="withDomainDropdown"
    class="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800  border border-gray-400 border-dashed ">
    <div class="flex items-center font-mono text-gray-600 dark:text-gray-400">
      <OIcon
        collection="heroicons"
        name="globe-alt-solid"
        class="size-5 shrink-0 text-gray-400 dark:text-gray-500 mr-2" />

      <div class="flex items-center flex-1">
        <div
          ref="dropdownRef"
          class="relative inline-block flex-1">
          <button
            type="button"
            @click="isOpen = !isOpen"
            class="w-full text-left appearance-none bg-transparent group
            hover:text-brandcomp-600 dark:hover:text-brandcomp-400 cursor-pointer
            focus:outline-none px-0 flex items-center font-mono"
            aria-haspopup="listbox"
            :aria-expanded="isOpen">
            <span class="">https://</span>
            <span class="font-bold">{{ selectedDomain }}</span>
            <span class="">/secret/</span><span class="blur-sm">000000000000000 &nbsp;&nbsp;</span>
            <OIcon
              collection="heroicons"
              name="chevron-down"
              class="h-4 w-4 ml-1 text-gray-400 group-hover:text-brandcomp-500 dark:group-hover:text-brandcomp-400" />
          </button>

          <div
            v-if="isOpen"
            class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
            role="listbox">
            <div v-if="isLoading" class="p-2 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
            <div
              v-else
              v-for="domain in availableDomains"
              :key="domain"
              @click="selectDomain(domain)"
              class="p-2 hover:text-brandcomp-600 dark:hover:text-brandcomp-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
              role="option"
              :aria-selected="domain === selectedDomain">
              <span class="texts-gray-500">https://</span>
              <span class="font-bold">{{ domain }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  text-indent: 0;
  padding-right: 1rem;
}

select::-ms-expand {
  display: none;
}
</style>
