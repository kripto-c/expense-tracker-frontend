// ──────────────────────────────────────────────
// useService — React Query wrappers genéricos
// ──────────────────────────────────────────────

'use client'

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'

/**
 * Hook genérico para queries de lista (find)
 */
export function useFind<T>(
  queryKey: unknown[],
  fetcher: () => Promise<{ data: T[]; total: number }>,
  options?: Omit<UseQueryOptions<{ data: T[]; total: number }>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey,
    queryFn: fetcher,
    ...options,
  })
}

/**
 * Hook genérico para queries de un solo recurso (get)
 */
export function useGet<T>(
  queryKey: unknown[],
  fetcher: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey,
    queryFn: fetcher,
    ...options,
  })
}

/**
 * Hook genérico para mutaciones create / patch / remove.
 * Invalida las queryKeys al completar, y devuelve mutateAsync
 * para que el caller maneje onSuccess/onError desde la llamada.
 */
export function useServiceMutation<TData, TVariables>(
  mutationFn: (vars: TVariables) => Promise<TData>,
  invalidateKeys: unknown[][],
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn' | 'onSuccess'>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      )
    },
    ...options,
  })
}
