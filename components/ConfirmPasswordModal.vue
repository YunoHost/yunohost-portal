<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import type { Feedback } from '@/composables/form'

const { t } = useI18n()

const loading: Ref<boolean> = ref(false)
const feedback: Ref<Feedback> = ref(null)
const dialog: Ref<HTMLDialogElement> = ref()

defineExpose({
  requestPassword,
})

const { handleSubmit, setFieldError, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      currentpassword: yup.string().required(),
    })
  ),
  initialValues: {
    currentpassword: '',
  },
})

let resolvePassword: ((password: string | null) => void) | null = null
const onSubmit = handleSubmit(async (values) => {
  if (resolvePassword) {
    resolvePassword(values.currentpassword)
  }
})

let rejectPassword: (() => void) | null = null
const handleCancel = () => {
  if (rejectPassword) {
    rejectPassword()
  }
}

const closeDialog = () => {
  dialog.value?.close()
  resetForm()
  feedback.value = null
}

async function requestPassword(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    resolvePassword = (password: string | null) => {
      closeDialog()
      resolve(password)
    }

    rejectPassword = () => {
      closeDialog()
      resolve(null)
    }

    dialog.value?.showModal()
  })
}

const onDialogClose = () => {
  if (rejectPassword) {
    rejectPassword()
  }
}
</script>

<template>
  <dialog ref="dialog" class="modal" @close="onDialogClose">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ $t('confirm_password') }}
      </h3>

      <YForm :loading="loading" :feedback="feedback" @submit.prevent="onSubmit">
        <FormField
          name="currentpassword"
          :label="$t('current_password')"
          class="mb-3"
        >
          <TextInput
            name="currentpassword"
            type="password"
            autocomplete="current-password"
            class="w-full"
            :disabled="loading"
          />
        </FormField>

        <template #actions>
          <div class="flex gap-3 mt-3 ml-auto">
            <YButton
              type="button"
              variant="error"
              :title="$t('cancel')"
              :text="$t('cancel')"
              :disabled="loading"
              @click="handleCancel"
            />
            <SubmitButton
              variant="success"
              :loading="loading"
              :disabled="loading"
            />
          </div>
        </template>
      </YForm>
    </div>
    <div class="modal-backdrop" @click="handleCancel" />
  </dialog>
</template>