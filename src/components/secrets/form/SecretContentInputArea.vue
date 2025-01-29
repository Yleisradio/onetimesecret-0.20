<!-- src/components/secrets/form/SecretContentInputArea.vue -->

<script setup lang="ts">
import OIcon from '@/components/icons/OIcon.vue';
import { useCharCounter } from '@/composables/useCharCounter';
import { useTextarea } from '@/composables/useTextarea';
import { computed, watch, ref } from 'vue';

const props = withDefaults(defineProps<{
  maxLength?: number;
  initialContent?: string;
}>(), {
  maxLength: 10000,
});

const emit = defineEmits(['update:content']);

const mode = ref<'write' | 'preview'>('write');
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
  <div class="relative">
    <textarea
      ref="textareaRef"
      v-model="content"
      @input="checkContentLength"
      :maxlength="maxLength"
      class="block w-full min-h-[200px] resize-none rounded-lg border border-gray-200 bg-transparent p-4 font-mono text-base leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500"
      :placeholder="$t('web.COMMON.secret_placeholder')"
      aria-label="Secret content"
      autocomplete="off"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    />

    <!-- Character Counter -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-show="showCounter"
        class="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-gray-900/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all dark:bg-white/90 dark:text-gray-900"
        role="status"
        aria-live="polite"
      >
        <div class="h-2 w-2 rounded-full" :class="{
          'bg-green-400': charCount < maxLength * 0.8,
          'bg-yellow-400': charCount >= maxLength * 0.8 && charCount < maxLength * 0.95,
          'bg-red-400': charCount >= maxLength * 0.95
        }"></div>
        {{ formattedCharCount }}/{{ formattedMaxLength }}
      </div>
    </transition>
  </div>
</template>
