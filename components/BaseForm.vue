<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

const props = defineProps<{
  schema: yup.ObjectShape
  initialValues: Record<string, any>
}>()

const emit = defineEmits(['submit'])

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(yup.object(props.schema)),
  initialValues: props.initialValues,
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <slot name="default" />
  </form>
</template>
