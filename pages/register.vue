<script setup lang="ts">

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { exclude, pick } from '@/utils/common'
import type { User } from '@/composables/states'
import type { Feedback } from '@/composables/form'

const { t } = useI18n()
const settings = await useSettings()

definePageMeta({
  layout: false,
  public: true,
})

useHead({title: t('user_selfregistration_pagetitle')})
const isLoggedIn = useIsLoggedIn()

const loading: Ref<boolean> = ref(false)
const feedback: Ref<Feedback> = ref(null)

export interface RegistrationParams {
  username: string
  domain: string
  external_email: string
  tos: string
  custom_notes: string
}

const invitationToken = useRoute().query.invitation;
const confirmRequestId = useRoute().query.confirm;

let enableForm = false;
let formMode = "none";
let generalErrorMessage = undefined;
let onSubmit = undefined;
let registrationParams = undefined;
let formValues = undefined;
let generalSuccessMessage = undefined;

if (invitationToken) {
    useHead({title: t('user_invite_pagetitle')})
    const { error: invitationError, data: registrationParams_ } = await useApi<RegistrationParams>('/invitation', {
        method: "QUERY",
        body: new URLSearchParams({ token: invitationToken })
    })
    if (invitationError.value) {
        generalErrorMessage = invitationError.value.data.error || invitationError.value.data;
    }
    else {
        registrationParams = registrationParams_.value;
        enableForm = true;
        formMode = "invite";
    }
}
else if (confirmRequestId) {
    const { error: confirmError } = await useApi('/registration/' + confirmRequestId + '/confirm', { method: "PUT" })
    if (confirmError.value) {
        generalErrorMessage = confirmError.value.data.error || confirmError.value.data;
    }
    else {
        generalSuccessMessage = t('user_selfregistration_now_pending_validation');
    }
}
else if (settings.value.enable_self_registration) {
    const { error: error, data: challengeParams } = await useApi('/registration/challenge')

    enableForm = true;
    formMode = "selfregistration"

    registrationParams = {
        username: undefined,
        domain: settings.value.domain,
        external_email: undefined,
        tos: settings.value.registration_tos,
        custom_notes: settings.value.registration_self_registration_notes,
        require_and_verify_email: settings.value.registration_require_and_verify_email,
        challenge_token: challengeParams.value.token,
        challenge_calculation: challengeParams.value.calculation,
    }
}

if (enableForm)  {
    const { handleSubmit, setFieldError, resetForm, meta, values: formValues_, setFieldTouched } = useForm({
      validationSchema: toTypedSchema(
        yup.object({
          username: yup.string().required()
          .matches(/^[a-z0-9][-a-z0-9_\.]*$/, {
              excludeEmptyString: true,
              message: { key: 'v.username_regex' },
          }),
          fullname: yup.string().required().min(2),
          password: yup
            .string()
            .matches(/.{8,}/, {
              excludeEmptyString: true,
              message: { key: 'v.string_too_short', values: { min: 8 } },
            })
            .required(),
          confirmpassword: yup
            .string()
            .oneOf([yup.ref('password')], 'v.password_not_match')
            .required(),
          external_email: yup.string().email().when(([], schema) => {
                if (registrationParams.require_and_verify_email) {
                  return schema.required();
                }
                return schema.nullable().notRequired();
          }),
          notes: yup.string().max(1000).nullable(),
          accept_tos: yup.boolean().nullable(),
        }),
      ),
      initialValues: {
         username: (formMode == "invite") ? registrationParams.username || "" : "",
         external_email: (formMode == "invite") ? registrationParams.external_email || "" : "",
         challenge_token: (formMode == "selfregistration") ? registrationParams.challenge_token || "" : "",
      }
    })
    formValues = formValues_;

    // Submit logic

    if (formMode == "invite") {
        onSubmit = handleSubmit(async (form) => {
          loading.value = true

          const { error, data } = await useApi('/invitation', {
            method: 'POST',
            body: {
                token: invitationToken,
                username: formValues.username,
                fullname: formValues.fullname,
                password: formValues.password,
                external_email: formValues.external_email || undefined,
                accept_tos: registrationParams.tos ? document.getElementById("accept_tos").checked : undefined,
            }
          })

          if (error.value) {
            // Reset form dirty state but keep previous values
            feedback.value = {
              variant: 'error',
              icon: 'alert',
              message: error.value.data.error || error.value.data,
            }
          } else {
             enableForm = false;
             generalSuccessMessage = t('user_invite_success', {username: formValues.username});
          }

          loading.value = false
        })
    }
    else {
        onSubmit = handleSubmit(async (form) => {
          loading.value = true

          const { error, data } = await useApi('/registration', {
            method: 'POST',
            body: {
                username: formValues.username,
                fullname: formValues.fullname,
                password: formValues.password,
                external_email: formValues.external_email || undefined,
                notes: formValues.notes || undefined,
                accept_tos: registrationParams.tos ? document.getElementById("accept_tos").checked : undefined,
                challenge_token: document.getElementById("challenge_token").value,
                challenge_answer: formValues.challenge_answer,
            }
          })

          if (error.value) {
            // Reset form dirty state but keep previous values
            feedback.value = {
              variant: 'error',
              icon: 'alert',
              message: error.value.data.error || error.value.data,
            }

            // Get a new challenge thingy to be able to resubmit the form without having to refresh the page
            const { data: challengeParams } = await useApi('/registration/challenge')
            registrationParams.challenge_calculation = challengeParams.value.calculation
            document.getElementById("challenge_token").value = challengeParams.value.token
            document.getElementById("challenge_answer").value = ""

          } else {
             enableForm = false;
             if (registrationParams.require_and_verify_email) {
                generalSuccessMessage = t('user_selfregistration_to_be_confirmed_via_email_link');
             }
             else {
                generalSuccessMessage = t('user_selfregistration_now_pending_validation');
             }
          }
          loading.value = false
        })
    }
}
</script>

<template>

    <main class="m-auto max-w-[600px] px-3">
        <CustomLogo class="flex-none mx-auto w-1/2 mt-10" />
        <PageTitle :text="$t('user_invite_pagetitle')" v-if="formMode == 'invite'" class="w-full text-center" />
        <PageTitle :text="$t('user_selfregistration_pagetitle')" v-if="formMode == 'selfregistration'" class="w-full text-center" />

        <BaseAlert
            v-if="generalErrorMessage"
            variant="warning"
            icon="close"
            :message="generalErrorMessage"
            class="mt-4"
            assertive
        />

        <BaseAlert
            v-if="!invitationToken && !confirmRequestId && !enableForm && !generalSuccessMessage"
            variant="error"
            icon="close"
            :message="$t('user_selfregistration_not_enabled')"
            class="mt-4"
            assertive
        />

        <center v-if="generalSuccessMessage" >
            <BaseAlert
                variant="success"
                icon="thumb-up"
                :message="generalSuccessMessage"
                class="mt-4"
                assertive
            />
            <YButton
                variant="success"
                :text="$t('go_back_to_login')"
                icon="arrow-left"
                @click="navigateTo('/login')"
                class="mx-auto mt-3 w-fit"
            />
        </center>

        <BaseAlert
            v-if="enableForm && registrationParams.custom_notes"
            variant="info"
            :message="registrationParams.custom_notes"
            class="my-4"
            assertive
        />

        <YForm v-if="enableForm" :loading="loading" :feedback="feedback" @submit.prevent="onSubmit">

            <FormField
                name="username"
                :label="$t('username')"
                :description="registrationParams.username ? t('user_invite_fixed_username_help') : t('user_invite_username_help')"
                class="mb-4"
            >
                <TextInput
                    name="username"
                    type="text"
                    autocomplete="username"
                    autocapitalize="off"
                    spellcheck="false"
                    autofocus=""
                    class="w-full"
                    :disabled="registrationParams.username"
                />
            </FormField>

            <FormField
                name="fullname"
                :label="$t('fullname')"
                class="mb-4"
                >
                <TextInput
                    name="fullname"
                    type="text"
                    :placeholder="$t('user_fullname_placeholder')"
                    autocomplete="name"
                    class="w-full"
                    />
            </FormField>

            <FormField
                name="password"
                :label="$t('password')"
                :description="$t('good_practices_about_user_password')"
                class="mb-4">
                <TextInput
                    name="password"
                    type="password"
                    autocomplete="new-password"
                    class="w-full"
                />
            </FormField>

            <FormField
                name="confirmpassword"
                :label="$t('confirm_new_password')"
                class="mb-4">
                <TextInput
                    name="confirmpassword"
                    type="password"
                    autocomplete="new-password"
                    class="w-full"
                />
            </FormField>

            <FormField
                name="mail"
                :label="$t('primary_mail_address')"
                :description="$t('primary_mail_address_help')"
                class="mb-4">
                <TextInput name="mail" type="text" class="w-full" disabled :value="formValues.username + '@' + registrationParams.domain" />
            </FormField>

            <FormField
                name="external_email"
                :label="registrationParams.require_and_verify_email ? $t('external_mail_address') : $t('external_mail_address_optional')"
                :description="registrationParams.require_and_verify_email ? $t('external_mail_address_help') : $t('external_mail_address_optional_help') "
                class="mb-4">
                <TextInput name="external_email" type="text" class="w-full" />
            </FormField>

            <FormField
                v-if="formMode == 'selfregistration'"
                name="notes"
                :label="$t('user_selfregistration_notes')"
                class="mb-4"
                >
                <TextInput
                    name="notes"
                    type="textarea"
                    class="w-full !h-24 py-2"
                    maxlength="1000"
                    />
            </FormField>

            <FormField
                v-if="registrationParams.tos"
                name="accept_tos"
                label=""
                class="mb-4">
                <CheckboxInput name="accept_tos">
                    <NuxtLink
                      :to="registrationParams.tos"
                      target="_blank"
                      class="link text-base-content inline-block"
                    >
                        {{ t('user_accept_tos') }}
                        <YIcon name="external-link" aria-hidden="true" size="1em" />
                    </NuxtLink>
                </CheckboxInput>
                <template v-slot:label>
                    <span><!-- Dirty hack because checkboxes are a special cases in terms for input/label HTML topology... --></span>
                </template>
            </FormField>

            <FormField
                v-if="formMode == 'selfregistration'"
                name="challenge_token"
                label=""
                class="hidden"
                >
                <TextInput
                    name="challenge_token"
                    type="text"
                    class="w-full"
                    />
            </FormField>

            <FormField
                v-if="formMode == 'selfregistration'"
                name="challenge_answer"
                :label="$t('user_selfregistration_antibot_calculation', {calculation: registrationParams.challenge_calculation})"
                class="mb-4"
                >
                <TextInput
                    name="challenge_answer"
                    type="text"
                    class="w-full"
                />
            </FormField>

            <div id="submit-details" v-if="formMode == 'selfregistration'">
                <YIcon
                  name="information-outline"
                  aria-hidden="true"
                />
                {{
                   registrationParams.require_and_verify_email ?
                   t('user_selfregistration_confirm_mail_and_admin_validation_explaination') :
                   t('user_selfregistration_admin_validation_explaination')
                }}
            </div>
            <template v-slot:actions>
              <SubmitButton
                v-if="formMode == 'invite'"
                :loading="loading"
                :text="$t('user_invite_submit')"
                :loadingText="$t('user_invite_submit_loading')"
                icon="rocket-launch"
                variant="success"
                class="mx-auto mt-3 w-fit mb-20"
              />
              <SubmitButton
                v-if="formMode == 'selfregistration'"
                :loading="loading"
                :text="$t('user_selfregistration_submit')"
                :loadingText="$t('user_selfregistration_submit_loading')"
                icon="account-box-plus"
                variant="success"
                aria-describedby="submit-details"
                class="mx-auto mt-3 w-fit mb-20"
              />
            </template>

        </YForm>

    </main>

</template>

<style scoped>
.card .card-header {
  border-top-left-radius: var(--rounded-box);
  border-top-right-radius: var(--rounded-box);
}
</style>
