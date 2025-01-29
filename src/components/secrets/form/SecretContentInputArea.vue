<!-- src/components/secrets/form/SecretContentInputArea.vue -->
<script setup lang="ts">
  import OIcon from '@/components/icons/OIcon.vue';
  import { useCharCounter } from '@/composables/useCharCounter';
  import { useTextarea } from '@/composables/useTextarea';
  import { computed, watch } from 'vue';

  const props = withDefaults(
    defineProps<{
      maxLength?: number;
      initialContent?: string;
      disabled?: boolean;
    }>(),
    {
      maxLength: 10000,
      disabled: false,
    }
  );

  const emit = defineEmits(['update:content']);

  const { content, charCount, textareaRef, checkContentLength, clearTextarea } = useTextarea({
    maxLength: props.maxLength || 10000,
    initialContent: props.initialContent,
    maxHeight: 400,
    onContentChange: (newContent) => emit('update:content', newContent),
  });

  const { isHovering, handleMouseEnter, handleMouseLeave, formatNumber } = useCharCounter();

  // Computed properties
  const showCounter = computed(() => isHovering.value || charCount.value > props.maxLength! / 2);

  const formattedCharCount = computed(() => formatNumber(charCount.value));

  const formattedMaxLength = computed(() => formatNumber(props.maxLength!));

  const statusColor = computed(() => {
    const percentage = charCount.value / props.maxLength!;
    if (percentage < 0.8) return 'bg-emerald-400 dark:bg-emerald-500';
    if (percentage < 0.95) return 'bg-amber-400 dark:bg-amber-500';
    return 'bg-red-400 dark:bg-red-500';
  });

  // Watch for changes to emit updates
  watch(content, (newContent) => {
    emit('update:content', newContent);
  });

  defineExpose({ clearTextarea });
</script>

<template>
  <div class="relative">
    <textarea
      ref="textareaRef"
      v-model="content"
      :disabled="disabled"
      @input="checkContentLength"
      :maxlength="maxLength"
      class="block w-full min-h-[200px] resize-none
            rounded-lg border border-gray-200
            p-4 font-mono text-base leading-relaxed
            text-gray-900 placeholder:text-gray-400
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            dark:border-gray-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400
            transition-all duration-200"
      :placeholder="$t('web.COMMON.secret_placeholder')"
      aria-label="Message content"
      autocomplete="off"
      autofocus
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave" />

    <!-- Character Counter -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2">
      <div
        v-show="showCounter"
        class="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-gray-900/90 px-3 py-1.5 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all dark:bg-white/90 dark:text-gray-900"
        role="status"
        aria-live="polite">
        <div
          class="h-2 w-2 rounded-full transition-colors"
          :class="statusColor"></div>
        {{ formattedCharCount }}/{{ formattedMaxLength }}
      </div>
    </transition>
  </div>
</template>
