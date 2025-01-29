<!-- src/components/secrets/form/SecretContentInputArea.vue -->

<script setup lang="ts">
/**
 * SecretContentInputArea Component
 *
 * A form component for secure content input with optional domain selection.
 * Implements auto-resizing textarea, character counting, and domain dropdown functionality
 * through composable functions.
 *
 * Features:
 * - Auto-resizing textarea with maximum height constraint
 * - Real-time character counting with formatted display
 * - Optional domain selection dropdown with outside click detection
 * - Keyboard navigation support (Escape key handling)
 * - Dark mode compatible
 * - Accessibility compliant
 *
 * Technical Implementation:
 * - Uses composition API with dedicated composables:
 *   - useTextarea: Handles input, validation, and auto-resize
 *   - useDropdown: Manages dropdown state and interactions
 *   - useCharCounter: Provides character counting and formatting
 *   - useDomainDropdown: Handles domain selection state
 *
 * Props:
 * @prop {string[]} [availableDomains] - List of available domains for selection
 * @prop {string} [initialDomain] - Initially selected domain
 * @prop {boolean} [withDomainDropdown=false] - Enable/disable domain selection
 * @prop {number} [maxLength=10000] - Maximum character limit
 * @prop {string} [initialContent] - Initial textarea content
 *
 * Events:
 * @emits {string} update:selected-domain - Emitted when domain selection changes
 * @emits {string} update:content - Emitted when textarea content changes
 *
 * Usage:
 * ```vue
 * <SecretContentInputArea
 *   :availableDomains="['domain1.com', 'domain2.com']"
 *   :initialDomain="defaultDomain"
 *   :withDomainDropdown="true"
 *   :maxLength="5000"
 *   :initialContent="existingContent"
 *   @update:selectedDomain="handleDomainChange"
 *   @update:content="handleContentChange"
 * />
 * ```
 *
 * Accessibility:
 * - Proper ARIA labels for textarea and dropdown
 * - Keyboard navigation support
 * - Screen reader compatible character counter
 * - Focus management for dropdown
 *
 * Performance Considerations:
 * - Debounced textarea resizing
 * - Efficient character counting
 * - Optimized dropdown rendering (v-show vs v-if)
 *
 * @see {@link useTextarea} For textarea management implementation
 * @see {@link useDropdown} For dropdown behavior implementation
 * @see {@link useCharCounter} For character counting implementation
 * @see {@link useDomainDropdown} For domain selection implementation
 */
 import OIcon from '@/components/icons/OIcon.vue';
 import { useCharCounter } from '@/composables/useCharCounter';
 import { useDomainDropdown } from '@/composables/useDomainDropdown';
 import { useDropdown } from '@/composables/useDropdown';
 import { useTextarea } from '@/composables/useTextarea';
 import { computed, watch } from 'vue';

 const props = withDefaults(defineProps<{
   availableDomains?: string[];
   initialDomain?: string;
   withDomainDropdown?: boolean;
   maxLength?: number;
   initialContent?: string;
 }>(), {
   initialDomain: '',
   withDomainDropdown: false,
 });

 const emit = defineEmits(['update:selected-domain', 'update:content']);

 const { content, charCount, textareaRef, checkContentLength } = useTextarea({
   maxLength: props.maxLength || 10000,
   initialContent: props.initialContent,
   maxHeight: 400,
   onContentChange: (newContent) => emit('update:content', newContent)
 });

 const { isOpen, dropdownRef, toggle: toggleDropdown, close: closeDropdown } =
   useDropdown();

 const { isHovering, handleMouseEnter, handleMouseLeave, formatNumber } =
   useCharCounter();

 const { selectedDomain, updateSelectedDomain } = useDomainDropdown();

 // Computed properties
 const showCounter = computed(() =>
   isHovering.value || charCount.value > props.maxLength! / 2
 );

 const formattedCharCount = computed(() =>
   formatNumber(charCount.value)
 );

 const formattedMaxLength = computed(() =>
   formatNumber(props.maxLength!)
 );

 // Watch for changes to emit updates
 watch(content, (newContent) => {
   emit('update:content', newContent);
 });

 // Domain selection handler
 const selectDomain = (domain: string) => {
   updateSelectedDomain(domain);
   emit('update:selected-domain', domain);
   closeDropdown();
 };
 </script>

<template>
  <div
    class="relative"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <textarea
      ref="textareaRef"
      v-model="content"
      @input="checkContentLength"
      :maxlength="maxLength"
      class="max-h-[400px] min-h-24 w-full resize-none overflow-y-auto rounded-md border-gray-300 bg-white
            p-4 font-mono text-base
            leading-[1.2] tracking-wide
            shadow-sm transition-colors duration-200 placeholder:text-gray-400
            focus:border-brandcomp-500 focus:ring-brandcomp-500
            dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
      name="secret"
      autofocus
      autocomplete="off"
      :placeholder="$t('web.COMMON.secret_placeholder')"
      aria-label="Enter the secret content to share here">
    </textarea>

    <!--
      Generally speaking, v-if has higher toggle costs while v-show has higher
      initial render costs. So prefer v-show if you need to toggle something
      very often, and prefer v-if if the condition is unlikely to change at
      runtime. -- https://vuejs.org/guide/essentials/conditional.html#v-if-vs-v-show
    -->
    <div
      v-if="showCounter"
      class="pointer-events-none select-none hidden
            absolute bottom-4 right-4
            rounded-full bg-white px-3 py-1
            text-sm text-gray-400
            shadow-sm
            transition-colors duration-200
            dark:bg-gray-800 dark:text-gray-500">
      {{ formattedCharCount }} / {{ formattedMaxLength }} chars
    </div>

    <div
      v-if="withDomainDropdown"
      class="absolute bottom-4 right-4">
      <div
        class="relative inline-block text-left"
        ref="dropdownRef">
        <button
          type="button"
          @click="toggleDropdown"
          class="inline-flex w-full items-center justify-between rounded-md border border-gray-300
              bg-white px-4 py-2 text-sm font-medium
              text-gray-700 transition-colors duration-200 hover:bg-gray-50
              focus:outline-none focus:ring-2
              focus:ring-brandcomp-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300
              dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800">
          <span class="max-w-[150px] truncate">
            {{ selectedDomain || 'Select Domain' }}
          </span>
          <OIcon
            collection="heroicons"
            name="chevron-down-16-solid"
            class="ml-2 size-5 shrink-0 text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          />
        </button>

        <div
          v-if="isOpen"
          class="absolute right-0 z-50 mt-2 max-h-60 w-56 origin-top-right
              overflow-y-auto rounded-md
              bg-white shadow-lg ring-1 ring-black
              ring-opacity-5 focus:outline-none
              dark:bg-gray-800 dark:ring-gray-700">
          <div
            class="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu">
            <a
              v-for="domain in availableDomains"
              :key="domain"
              href="#"
              @click.prevent="selectDomain(domain)"
              class="block px-4 py-2 text-sm text-gray-700 transition-colors
                  duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300
                  dark:hover:bg-gray-700 dark:hover:text-white"
              role="menuitem">
              {{ domain }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the dropdown container has a higher z-index than the input field */
.absolute {
  z-index: 40;
}
</style>
