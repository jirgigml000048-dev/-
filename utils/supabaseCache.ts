import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PurchaseList, FlowerAnnotation } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

export interface PhotoCache {
  purchase_list: PurchaseList;
  annotations: FlowerAnnotation[];
}

export async function getPhotoCache(photoId: string): Promise<PhotoCache | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('photo_cache')
    .select('purchase_list, annotations')
    .eq('photo_id', photoId)
    .maybeSingle();
  if (error || !data) return null;
  return data as PhotoCache;
}

export async function setPhotoCache(
  photoId: string,
  purchaseList: PurchaseList,
  annotations: FlowerAnnotation[]
): Promise<void> {
  if (!supabase) return;
  await supabase.from('photo_cache').upsert(
    { photo_id: photoId, purchase_list: purchaseList, annotations },
    { onConflict: 'photo_id', ignoreDuplicates: true }
  );
}
