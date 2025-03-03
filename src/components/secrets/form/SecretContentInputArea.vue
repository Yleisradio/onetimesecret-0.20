<!-- src/components/secrets/form/SecretContentInputArea.vue -->

<script setup lang="ts">
  import { useCharCounter } from '@/composables/useCharCounter';
  import { useTextarea } from '@/composables/useTextarea';
  import { computed, watch } from 'vue';

  const props = withDefaults(
    defineProps<{
      maxLength?: number;
      initialContent?: string;
      cornerClass?: string;
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

  const { isHovering, formatNumber } = useCharCounter();

  // Computed properties
  const showCounter = computed(() => isHovering.value || charCount.value > props.maxLength! / 2);

  const formattedCharCount = computed(() => formatNumber(charCount.value));

  const formattedMaxLength = computed(() => formatNumber(props.maxLength!));

  // const statusColor = computed(() => {
  //   const percentage = charCount.value / props.maxLength!;
  //   if (percentage < 0.8) return 'bg-emerald-400 dark:bg-emerald-500';
  //   if (percentage < 0.95) return 'bg-amber-400 dark:bg-amber-500';
  //   return 'bg-red-400 dark:bg-red-500';
  // });

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
      :class="[cornerClass]"
      class="block w-full min-h-[200px] resize-none rounded-lg border border-gray-200 p-4 font-mono text-base leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all duration-200"
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
      class="pointer-events-none select-none hidden rounded-full bg-white px-3 py-1 text-sm text-gray-400 shadow-sm transition-colors duration-200 dark:bg-gray-800 dark:text-gray-500">
      {{
        $t('formattedcharcount-formattedmaxlength-chars', [formattedCharCount, formattedMaxLength])
      }}
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
          class="inline-flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brandcomp-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800">
          <span class="max-w-[150px] truncate">
            {{ selectedDomain || 'Select Domain' }}
          </span>
          <OIcon
            collection="heroicons"
            name="chevron-down-16-solid"
            class="ml-2 size-5 shrink-0 text-gray-400 dark:text-gray-500"
            aria-hidden="true" />
        </button>

        <div
          v-if="isOpen"
          class="absolute right-0 z-50 mt-2 max-h-60 w-56 origin-top-right overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
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
              class="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              role="menuitem">
              {{ domain }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
