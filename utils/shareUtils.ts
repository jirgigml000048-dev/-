// Unicode-safe base64url encode/decode for sharing purchase lists via URL
import { PurchaseList } from '../types';

export interface SharePayload {
  purchaseList: PurchaseList;
  heroImageUrl?: string; // only included when it's a path URL, not a base64 data URL
}

export function encodeShare(obj: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodeShare(str: string): unknown {
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes));
}
