<script setup lang="ts">
import type { Feedback } from '@/composables/form'

withDefaults(
  defineProps<{
    loading: boolean | null
    feedback?: Feedback
    submitVariant?: 'success' | 'warning' | 'error'
  }>(),
  {
    feedback: null,
    submitVariant: 'success',
  },
)
</script>

<template>
  <form class="flex flex-col h-full" novalidate v-bind="$attrs">
    <slot name="default" />

    <!-- Success + generic error announcement -->
    <BaseAlert v-show="feedback" v-bind="feedback" class="mb-8" />

    <!-- SR "loading" announcement -->
    <BaseAlert
      :message="loading ? $t('api.processing') : ''"
      class="sr-only"
      assertive
    />

    <div class="mt-auto flex">
      <slot name="actions">
        <SubmitButton
          :loading="loading"
          :variant="submitVariant"
          class="ms-auto mt-3"
        />
      </slot>
    </div>
  </form>
</template>
