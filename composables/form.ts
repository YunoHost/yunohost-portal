export const formGroupExtras = Symbol('form-group-extras') as InjectionKey<{
  invalid: Ref<boolean>
  describedBy: Ref<string | undefined>
}>
