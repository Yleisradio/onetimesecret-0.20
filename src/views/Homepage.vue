<script setup lang="ts">
  import HomepageTaglines from '@/components/HomepageTaglines.vue';
  // import HomepagePlansCTA from '@/components/ctas/HomepagePlansCTA.vue';
  import SecretForm from '@/components/secrets/form/SecretForm.vue';
  import { WindowService } from '@/services/window.service';
  // import { computed } from 'vue';

  const authenticated = WindowService.get('authenticated') ?? false;
  // const authenticationSettings = WindowService.get('authentication');
  // const showPlansCTA = computed(() => authenticationSettings?.signup);
</script>

<template>
  <div class="container mx-auto min-w-[320px] max-w-2xl py-1">
    <HomepageTaglines
      v-if="!authenticated"
      class="mb-6" />

    <!-- <HomepagePlansCTA /> -->

    <SecretForm
      class="mb-8"
      :with-recipient="false"
      :with-asterisk="true"
      :with-generate="true" />

  </div>
</template>
