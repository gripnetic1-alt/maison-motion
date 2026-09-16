import { MAX_PHOTOS, MIN_PHOTOS, validatePhotoCount } from "./validators";

export type AssetType = "villa" | "rental" | "yacht" | "private_jet" | "supercar";

export type AssetMetadataByType = {
  villa: { bedrooms?: number; bathrooms?: number; areaSqm?: number; pool?: boolean; view?: string };
  rental: { bedrooms?: number; bathrooms?: number; furnished?: boolean; monthlyRent?: number; leaseType?: string };
  yacht: { lengthMeters?: number; cabins?: number; guests?: number; homePort?: string; year?: number };
  private_jet: { aircraftModel?: string; seats?: number; rangeKm?: number; baseAirport?: string; year?: number };
  supercar: { makeModel?: string; year?: number; horsepower?: number; color?: string; mileageKm?: number };
};

export type AssetMetadata = AssetMetadataByType[AssetType] & { notes?: string };

export type AssetRecord<T extends AssetType = AssetType> = {
  id: string;
  name: string;
  type: T;
  location: string;
  metadata: AssetMetadataByType[T] & { notes?: string };
  photoCount: number;
  createdAt: string;
};
export type Asset = { [T in AssetType]: AssetRecord<T> }[AssetType];

export type AssetField = { key: string; label: string; placeholder: string; inputType?: "text" | "number" };
export type AssetTypeDefinition = { type: AssetType; label: string; shortLabel: string; description: string; fields: AssetField[] };

export const assetTypeDefinitions: AssetTypeDefinition[] = [
  { type: "villa", label: "Villa & maison", shortLabel: "Villa", description: "Architecture, volumes et lumière.", fields: [{ key: "bedrooms", label: "Chambres", placeholder: "5", inputType: "number" }, { key: "areaSqm", label: "Surface (m²)", placeholder: "220", inputType: "number" }, { key: "view", label: "Point fort", placeholder: "Vue mer, jardin paysager…" }] },
  { type: "rental", label: "Location", shortLabel: "Location", description: "Un lieu de vie qui se projette.", fields: [{ key: "bedrooms", label: "Chambres", placeholder: "2", inputType: "number" }, { key: "monthlyRent", label: "Loyer mensuel (€)", placeholder: "2400", inputType: "number" }, { key: "leaseType", label: "Type de bail", placeholder: "Meublé, longue durée…" }] },
  { type: "yacht", label: "Yacht", shortLabel: "Yacht", description: "Lignes, ponts et horizon.", fields: [{ key: "lengthMeters", label: "Longueur (m)", placeholder: "27", inputType: "number" }, { key: "guests", label: "Passagers", placeholder: "10", inputType: "number" }, { key: "homePort", label: "Port d’attache", placeholder: "Monaco, Cannes…" }] },
  { type: "private_jet", label: "Jet privé", shortLabel: "Jet privé", description: "L’espace de voyage, autrement.", fields: [{ key: "aircraftModel", label: "Modèle", placeholder: "Gulfstream G650…" }, { key: "seats", label: "Places", placeholder: "14", inputType: "number" }, { key: "baseAirport", label: "Aéroport de base", placeholder: "LFPG, LFPB…" }] },
  { type: "supercar", label: "Supercar", shortLabel: "Supercar", description: "Design, puissance et présence.", fields: [{ key: "makeModel", label: "Marque & modèle", placeholder: "Ferrari 296 GTB…" }, { key: "year", label: "Année", placeholder: "2025", inputType: "number" }, { key: "horsepower", label: "Puissance (ch)", placeholder: "830", inputType: "number" }] },
];

export const assetTypeMap = new Map(assetTypeDefinitions.map((definition) => [definition.type, definition]));

export function getAssetTypeDefinition(type: AssetType) { return assetTypeMap.get(type) ?? assetTypeDefinitions[0]; }

export function validateAssetMetadata(type: AssetType, metadata: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const numericKeys = ["bedrooms", "bathrooms", "areaSqm", "monthlyRent", "lengthMeters", "cabins", "guests", "year", "seats", "rangeKm", "horsepower", "mileageKm"];
  numericKeys.forEach((key) => { if (metadata[key] !== undefined && metadata[key] !== "" && (!Number.isFinite(Number(metadata[key])) || Number(metadata[key]) < 0)) errors[key] = "Indiquez une valeur positive."; });
  if (type === "yacht" && metadata.lengthMeters !== undefined && metadata.lengthMeters !== "" && Number(metadata.lengthMeters) < 4) errors.lengthMeters = "Un yacht doit mesurer au moins 4 m.";
  if (type === "private_jet" && metadata.seats !== undefined && metadata.seats !== "" && Number(metadata.seats) < 2) errors.seats = "Indiquez au moins 2 places.";
  if (type === "supercar" && metadata.horsepower !== undefined && metadata.horsepower !== "" && Number(metadata.horsepower) < 100) errors.horsepower = "Indiquez au moins 100 ch.";
  return errors;
}

export function validateAssetDraft(draft: { name: string; location: string; type: AssetType; metadata: Record<string, unknown>; photoCount: number; rightsConfirmed: boolean }) {
  const errors = validateAssetMetadata(draft.type, draft.metadata);
  if (!draft.name.trim()) errors.name = "Donnez un nom à cet actif.";
  if (!draft.location.trim()) errors.location = "Indiquez une localisation ou un port d’attache.";
  const photoError = validatePhotoCount(draft.photoCount);
  if (photoError) errors.photos = photoError;
  if (!draft.rightsConfirmed) errors.rights = "La confirmation des droits est obligatoire.";
  return errors;
}

export const assetFixtures: Asset[] = [
  { id: "asset-villa-pins", name: "Villa des Pins", type: "villa", location: "Cap Ferret · 8 pièces", metadata: { bedrooms: 5, areaSqm: 220, pool: true }, photoCount: 18, createdAt: "Il y a 2 h" },
  { id: "asset-yacht-marea", name: "Marea 86", type: "yacht", location: "Cannes · 26 m", metadata: { lengthMeters: 26, guests: 10, homePort: "Cannes" }, photoCount: 16, createdAt: "Hier" },
  { id: "asset-jet-gulfstream", name: "Gulfstream G650", type: "private_jet", location: "Paris-Le Bourget · 14 places", metadata: { aircraftModel: "G650", seats: 14 }, photoCount: 12, createdAt: "12 sept." },
];

export { MAX_PHOTOS, MIN_PHOTOS };
