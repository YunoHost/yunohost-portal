export type Feedback = {
  variant: 'success' | 'warning' | 'error'
  icon: string
  message: string
} | null

export const formGroupExtras = Symbol('form-group-extras') as InjectionKey<{
  invalid: Ref<boolean>
  describedBy: Ref<string | undefined>
}>
