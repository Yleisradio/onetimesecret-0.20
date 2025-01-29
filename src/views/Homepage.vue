<script setup lang="ts">
  import HomepagePlansCTA from '@/components/ctas/HomepagePlansCTA.vue';
  import HomepageTaglines from '@/components/HomepageTaglines.vue';
  import SecretForm from '@/components/secrets/form/SecretForm.vue';
  import { WindowService } from '@/services/window.service';
  import { computed } from 'vue';

  const authenticated = WindowService.get('authenticated') ?? false;
  const authenticationSettings = WindowService.get('authentication');
  const showPlansCTA = computed(() => authenticationSettings?.signup);
</script>

<template>
  <div class="container mx-auto min-w-[320px] max-w-2xl py-1">
  <template v-if="!authenticated"
                    class="mb-6" >
    <div class="flex flex-col items-center text-center">
      <h3 class="font-base mb-2 text-gray-600 dark:text-gray-100 sm:mx-12 sm:block md:mx-2">
        {{ $t('web.homepage.tagline1') }}
      </h3>
      <p class="mx-12 mb-6 text-base italic text-gray-400 dark:text-gray-400 sm:mx-2">
        {{ $t('web.homepage.tagline2') }}
      </p>
    </div>
  </template>

    <SecretForm class="mb-8"
                :with-recipient="false"
                :with-asterisk="true"
                :with-generate="true" />

  </div>
</template>
