import { test } from "node:test";
import assert from "node:assert/strict";
import { whatsappUrl } from "../src/features/contact/contact.ts";

test("WhatsApp links contain the correct recipient and product context", () => {
  const general = new URL(whatsappUrl());
  assert.equal(general.pathname, "/5511934640404");
  assert.match(general.searchParams.get("text"), /Céu de Lavanda/);
  const specific = new URL(whatsappUrl({ name: "Acquaré", slug: "acquare" }));
  assert.match(specific.searchParams.get("text"), /Acquaré/);
  assert.match(specific.searchParams.get("text"), /https:\/\/ceu-de-lavanda\.pages\.dev\/produtos\/acquare\//);
  assert.doesNotMatch(specific.searchParams.get("text"), /50 ml|100 ml/);
});
