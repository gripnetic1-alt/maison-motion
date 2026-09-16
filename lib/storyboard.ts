export type StoryboardScene = {
  order: number;
  title: string;
  durationSeconds: number;
  visualDirection: string;
  caption: string;
  transition: "dissolve" | "pan" | "cut";
};

import type { AssetMetadata, AssetType } from "./assets";

export type Storyboard = {
  version: "mock-1";
  assetName: string;
  assetType: AssetType;
  metadata: AssetMetadata;
  totalDurationSeconds: number;
  scenes: StoryboardScene[];
};

const genericTemplate: Omit<StoryboardScene, "order">[] = [
  { title: "L’entrée en matière", durationSeconds: 4, visualDirection: "Plan d’ouverture lent, contexte et silhouette de l’actif.", caption: "Une présence qui donne le ton.", transition: "dissolve" },
  { title: "La signature", durationSeconds: 5, visualDirection: "Mouvement latéral sur les lignes et les proportions.", caption: "Une signature reconnaissable.", transition: "pan" },
  { title: "Le détail juste", durationSeconds: 5, visualDirection: "Détails rapprochés, textures et finitions.", caption: "Le beau se joue dans les détails.", transition: "cut" },
  { title: "L’expérience", durationSeconds: 5, visualDirection: "Séquence immersive, de l’usage vers la sensation.", caption: "Tout ce qu’il faut pour se projeter.", transition: "dissolve" },
  { title: "L’horizon", durationSeconds: 5, visualDirection: "Travelling doux vers la vue, la route ou le ciel.", caption: "Une nouvelle histoire commence ici.", transition: "pan" },
  { title: "À vous de jouer", durationSeconds: 4, visualDirection: "Plan final avec cartouche et appel à l’action.", caption: "Prêt à faire mouvement ?", transition: "dissolve" },
];

const typeTemplates: Record<AssetType, Omit<StoryboardScene, "order">[]> = {
  villa: [{ title: "L’arrivée", durationSeconds: 4, visualDirection: "Approche douce de la façade, jardin et lumière du lieu.", caption: "Une adresse qui donne envie d’arriver.", transition: "dissolve" }, { title: "Les volumes", durationSeconds: 5, visualDirection: "Panoramique des pièces de vie et perspectives traversantes.", caption: "Des volumes pensés pour respirer.", transition: "pan" }, { title: "La matière", durationSeconds: 5, visualDirection: "Focus sur pierre, bois, menuiseries et finitions.", caption: "Le caractère se révèle dans les détails.", transition: "cut" }, { title: "La lumière", durationSeconds: 5, visualDirection: "Travelling vers la terrasse, la piscine ou la vue.", caption: "Une lumière à habiter.", transition: "pan" }, { title: "La projection", durationSeconds: 4, visualDirection: "Plan final de vie autour de la maison.", caption: "Ici, la vie prend sa place.", transition: "dissolve" }],
  rental: [{ title: "Le seuil", durationSeconds: 4, visualDirection: "Ouverture sur l’entrée, la circulation et le premier volume.", caption: "Un nouveau quotidien commence ici.", transition: "dissolve" }, { title: "Le plan de vie", durationSeconds: 5, visualDirection: "Mouvement fluide entre séjour, cuisine et espaces utiles.", caption: "Tout est à sa juste place.", transition: "pan" }, { title: "Le confort", durationSeconds: 5, visualDirection: "Détails de rangement, lumière, matières et équipements.", caption: "Le confort, sans compromis.", transition: "cut" }, { title: "Le quartier", durationSeconds: 5, visualDirection: "Fenêtres, balcon ou vues qui racontent l’environnement.", caption: "La ville autour, la vie dedans.", transition: "pan" }, { title: "Se projeter", durationSeconds: 4, visualDirection: "Cadre final lumineux, prêt à accueillir une histoire.", caption: "Il ne manque plus que vous.", transition: "dissolve" }],
  yacht: [{ title: "Ligne d’eau", durationSeconds: 4, visualDirection: "Glissement sur la coque, l’étrave et le reflet du port.", caption: "Une silhouette faite pour prendre le large.", transition: "dissolve" }, { title: "Le pont", durationSeconds: 5, visualDirection: "Travelling sur les espaces extérieurs et la circulation à bord.", caption: "Le large comme horizon quotidien.", transition: "pan" }, { title: "La cabine", durationSeconds: 5, visualDirection: "Détails des bois, textiles, lumière et finitions marines.", caption: "Le luxe tient le cap.", transition: "cut" }, { title: "À bord", durationSeconds: 5, visualDirection: "Séquence immersive autour des usages et de la vie en mer.", caption: "Des souvenirs avant même le départ.", transition: "dissolve" }, { title: "Le large", durationSeconds: 4, visualDirection: "Élargissement final sur la mer et le sillage.", caption: "L’horizon vous appartient.", transition: "pan" }],
  private_jet: [{ title: "Le départ", durationSeconds: 4, visualDirection: "Ouverture sur la ligne de l’appareil et l’aéroport.", caption: "Le temps commence à s’étirer.", transition: "dissolve" }, { title: "La cabine", durationSeconds: 5, visualDirection: "Travelling dans la cabine, sièges et espace de circulation.", caption: "Voyager avec de l’espace.", transition: "pan" }, { title: "Le détail", durationSeconds: 5, visualDirection: "Focus sur les matières, l’éclairage et les finitions.", caption: "Chaque détail est à sa place.", transition: "cut" }, { title: "L’altitude", durationSeconds: 5, visualDirection: "Fenêtres, horizon et sensation de mouvement.", caption: "Voir plus loin, plus vite.", transition: "pan" }, { title: "À destination", durationSeconds: 4, visualDirection: "Plan final de l’appareil prêt à repartir.", caption: "Le monde est à portée de main.", transition: "dissolve" }],
  supercar: [{ title: "La présence", durationSeconds: 4, visualDirection: "Révélation de la silhouette, carrosserie et signature lumineuse.", caption: "Une présence qui ne passe pas inaperçue.", transition: "dissolve" }, { title: "Le design", durationSeconds: 5, visualDirection: "Mouvement sur les lignes, jantes, optiques et proportions.", caption: "Le mouvement commence à l’arrêt.", transition: "pan" }, { title: "La matière", durationSeconds: 5, visualDirection: "Détails rapprochés du cuir, carbone, badges et assemblages.", caption: "La précision se ressent.", transition: "cut" }, { title: "La route", durationSeconds: 5, visualDirection: "Séquence dynamique sur la route et la relation au paysage.", caption: "Chaque virage devient une signature.", transition: "pan" }, { title: "Le dernier regard", durationSeconds: 4, visualDirection: "Plan final iconique, cadrage bas et lumière sculptée.", caption: "Prêt à prendre la route ?", transition: "dissolve" }],
};

export function generateStoryboard(assetName: string, photoCount: number, assetType: AssetType = "villa", metadata: AssetMetadata = {}): Storyboard {
  const template = typeTemplates[assetType] ?? genericTemplate;
  const sceneCount = Math.min(template.length, Math.max(4, Math.ceil(photoCount / 6)));
  const scenes = template.slice(0, sceneCount).map((scene, index) => ({ ...scene, order: index + 1 }));
  return { version: "mock-1", assetName, assetType, metadata, totalDurationSeconds: scenes.reduce((total, scene) => total + scene.durationSeconds, 0), scenes };
}
