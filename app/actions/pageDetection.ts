'use server';

import { getAvailablePagesSync, PagePermission } from '@/app/lib/pageDetection';

export async function getAvailablePages(): Promise<PagePermission[]> {
  return getAvailablePagesSync();
}
