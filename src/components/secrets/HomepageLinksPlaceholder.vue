<!-- src/components/secrets/HomepageLinksPlaceholder.vue -->
<script setup lang="ts">
  import { ref } from 'vue';

  defineProps({
    title: { type: String, default: 'No secrets yet' },
    description: { type: String, default: 'Create a secret above to get started.' },
  });

  const mousePosition = ref({ x: 0, y: 0 });
  const isHovered = ref(false);

  function onMouseMove(event: MouseEvent) {
    if (!isHovered.value) return;
    const target = event.currentTarget as HTMLElement;
    const bounds = target.getBoundingClientRect();
    mousePosition.value = {
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    };
  }
</script>

<template>
  <div
    class="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center transition-all duration-300"
    :style="{
      '--cursor-x': `${mousePosition.x}%`,
      '--cursor-y': `${mousePosition.y}%`,
    }"
    @mousemove="onMouseMove"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    role="region"
    :aria-label="title"
    tabindex="0">
    <!-- Interactive background gradient -->
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
      :style="{
        background: isHovered
          ? `radial-gradient(circle at var(--cursor-x) var(--cursor-y),
             var(--tw-gradient-from) 0%,
             var(--tw-gradient-via) 25%,
             var(--tw-gradient-to) 100%)`
          : '',
      }"
      aria-hidden="true"></div>

    <h3
      class="relative text-lg font-medium text-gray-500 dark:text-gray-100 mb-2"
      :id="title.toLowerCase().replace(/\s+/g, '-')">
      {{ title }}
    </h3>

    <p
      class="relative text-gray-400 dark:text-gray-400"
      :aria-describedby="title.toLowerCase().replace(/\s+/g, '-')">
      {{ description }}
    </p>

    <!-- Focus outline for keyboard navigation -->
    <div
      class="absolute inset-0 rounded-lg ring-2 ring-offset-2 ring-blue-500 opacity-0 focus-within:opacity-100"
      aria-hidden="true"></div>
  </div>
</template>

<style>
  :root {
 --tw-gradient-from: rgb(220 74 34 / 100%);     /* dc4a22 */
 --tw-gradient-via: rgb(220 74 34 / 30%);     /* dc4a22 */
 --tw-gradient-to: rgb(220 74 34 / 0%);       /* dc4a22 */
}

:root[class~="dark"] {
 --tw-gradient-from: rgb(220 74 34 / 100%);     /* dc4a22 */
 --tw-gradient-via: rgb(220 74 34 / 40%);     /* dc4a22 */
 --tw-gradient-to: rgb(220 74 34 / 0%);       /* dc4a22 */
}
</style>
