export const MIN_PHOTOS = 10;
export const MAX_PHOTOS = 30;

/** @deprecated Kept for consumers of the first property-only starter. New code should use AssetDraft. */
export type PropertyDraft = {
  name: string;
  address: string;
  photoCount: number;
  rightsConfirmed: boolean;
};

export function validatePhotoCount(count: number) {
  if (!Number.isInteger(count) || count < MIN_PHOTOS || count > MAX_PHOTOS) {
    return `Ajoutez entre ${MIN_PHOTOS} et ${MAX_PHOTOS} photos.`;
  }
  return null;
}

/** @deprecated Kept as a compatibility shim for the first property-only starter. */
export function validatePropertyDraft(draft: PropertyDraft) {
  const errors: Record<string, string> = {};
  if (!draft.name.trim()) errors.name = "Donnez un nom à ce logement.";
  if (!draft.address.trim()) errors.address = "Indiquez au moins la ville ou l’adresse.";
  const photoError = validatePhotoCount(draft.photoCount);
  if (photoError) errors.photos = photoError;
  if (!draft.rightsConfirmed) errors.rights = "La confirmation des droits est obligatoire.";
  return errors;
}
