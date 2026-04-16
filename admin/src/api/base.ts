import { treaty } from '@elysiajs/eden';
import type { App } from '@backend/src';

export const apiDomain = import.meta.env.VITE_API_DOMAIN;

// wth is eden treaty im not a blue archive player
// @ts-expect-error
export const client = treaty<App>(apiDomain, {
  fetch: { credentials: 'include' },
  onResponse: async (res) => {
    if (res.status == 401) {
      location.replace('/login');
    }
  },
}).api.admin;

export function handleError(error: { status: number; value: any } | null) {
  if (error) {
    if (error.status != 422 && error.value?.detail != null)
      throw new Error(error.value.detail)
    throw new Error('Kesalahan sistem');
  }
}
