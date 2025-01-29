<!-- src/components/secrets/form/SecretContentInputArea.vue -->

<script setup lang="ts">
/**
 * SecretContentInputArea Component
 *
 * A form component for secure content input.
 * Implements auto-resizing textarea and character counting functionality
 * through composable functions.
 *
 * Features:
 * - Auto-resizing textarea with maximum height constraint
 * - Real-time character counting with formatted display
 * - Keyboard navigation support (Escape key handling)
 * - Dark mode compatible
 * - Accessibility compliant
 *
 * Technical Implementation:
 * - Uses composition API with dedicated composables:
 *   - useTextarea: Handles input, validation, and auto-resize
 *   - useCharCounter: Provides character counting and formatting
 *
 * Props:
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
 *   :maxLength="5000"
 *   :initialContent="existingContent"
 *   @update:content="handleContentChange"
 * />
 * ```
 *
 * Accessibility:
 * - Proper ARIA labels for textarea and dropdown
 * - Keyboard navigation support
 * - Screen reader compatible character counter
 *
 * Performance Considerations:
 * - Debounced textarea resizing
 * - Efficient character counting
 * - Optimized dropdown rendering (v-show vs v-if)
 *
 * @see {@link useTextarea} For textarea management implementation
 * @see {@link useCharCounter} For character counting implementation
 */

 import { useCharCounter } from '@/composables/useCharCounter';
 import { useTextarea } from '@/composables/useTextarea';
 import { computed, watch } from 'vue';

 const props = withDefaults(defineProps<{
   maxLength?: number;
   initialContent?: string;
 }>(), {
   maxLength: 10000,
 });

 const emit = defineEmits(['update:selected-domain', 'update:content']);

 const { content, charCount, textareaRef, checkContentLength } = useTextarea({
   maxLength: props.maxLength || 10000,
   initialContent: props.initialContent,
   maxHeight: 400,
   onContentChange: (newContent) => emit('update:content', newContent)
 });

 const { isHovering, handleMouseEnter, handleMouseLeave, formatNumber } =
   useCharCounter();

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
  </div>
</template>

<style scoped>
/* Ensure the dropdown container has a higher z-index than the input field */
.absolute {
  z-index: 40;
}
</style>
