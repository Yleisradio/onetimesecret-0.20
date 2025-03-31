<script setup lang="ts">
  import InboundSecretForm from '@/components/secrets/form/InboundSecretForm.vue';

</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">

    <InboundSecretForm
      :enabled="true"
      :title="$t('support-details')"
    />
  </div>
</template>
