import assert from "node:assert/strict";
import test from "node:test";
import { assetTypeDefinitions, validateAssetDraft, validateAssetMetadata } from "@/lib/assets";
import { generateStoryboard } from "@/lib/storyboard";
import { validatePhotoCount } from "@/lib/validators";

test("supports every premium asset type", () => {
  assert.deepEqual(assetTypeDefinitions.map((definition) => definition.type), ["villa", "rental", "yacht", "private_jet", "supercar"]);
});

test("storyboard copy changes for every asset type", () => {
  const captions = assetTypeDefinitions.map((definition) => generateStoryboard("Test asset", 10, definition.type).scenes[0].caption);
  assert.equal(new Set(captions).size, assetTypeDefinitions.length);
  assert.equal(generateStoryboard("Marea", 16, "yacht").assetType, "yacht");
});

test("metadata validation checks category-specific constraints", () => {
  assert.ok(validateAssetMetadata("yacht", { lengthMeters: 2 }).lengthMeters);
  assert.ok(validateAssetMetadata("private_jet", { seats: 1 }).seats);
  assert.ok(validateAssetMetadata("supercar", { horsepower: 80 }).horsepower);
  assert.deepEqual(validateAssetMetadata("villa", { bedrooms: 5, areaSqm: 220 }), {});
});

test("photo bounds and rights are required", () => {
  assert.ok(validatePhotoCount(9));
  assert.equal(validatePhotoCount(10), null);
  assert.ok(validatePhotoCount(31));
  assert.ok(validateAssetDraft({ name: "Yacht", location: "Cannes", type: "yacht", metadata: {}, photoCount: 10, rightsConfirmed: false }).rights);
  assert.deepEqual(validateAssetDraft({ name: "Yacht", location: "Cannes", type: "yacht", metadata: {}, photoCount: 10, rightsConfirmed: true }), {});
});
