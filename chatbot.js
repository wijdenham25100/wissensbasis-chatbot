require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const client = new Anthropic();
const WISSEN_DIR = path.join(__dirname, "wissen");

// Alle Markdown-Dokumente aus dem wissen/-Ordner laden
function ladeDokumente() {
  return fs.readdirSync(WISSEN_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      name: f,
      text: fs.readFileSync(path.join(WISSEN_DIR, f), "utf8"),
    }));
}

// Einfaches Retrieval: Dokumente nach Stichwort-Treffern bewerten
// (bewusst simpel gehalten – im README als Limitation dokumentieren!)
function findePassendeDokumente(frage, dokumente, anzahl = 2) {
  const woerter = frage.toLowerCase().split(/\W+/).filter((w) => w.length >= 3);
  return dokumente
    .map((d) => ({
      ...d,
      score: woerter.filter((w) => d.text.toLowerCase().includes(w)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, anzahl)
    .filter((d) => d.score > 0);
}

async function beantworteFrage(frage) {
  const passende = findePassendeDokumente(frage, ladeDokumente());

  if (passende.length === 0) {
    return "Dazu finde ich nichts in der Wissensbasis. (Keine Halluzination – der Bot antwortet nur aus den Dokumenten.)";
  }

  const kontext = passende
    .map((d) => `### Dokument: ${d.name}\n${d.text}`)
    .join("\n\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1500,
    messages: [{
      role: "user",
      content: `Beantworte die folgende Frage AUSSCHLIESSLICH auf Basis der
bereitgestellten Dokumente. Wenn die Antwort dort nicht enthalten ist,
sage das ehrlich, statt zu raten. Nenne am Ende der Antwort unter
"Quelle:" den Dateinamen des verwendeten Dokuments.

${kontext}

Frage: ${frage}`,
    }],
  });

  return response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

// Interaktive Konsolen-Schleife
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("Wissensbasis-Chatbot – Frage eingeben ('exit' zum Beenden)");

function frageLoop() {
  rl.question("\nDu: ", async (frage) => {
    if (frage.trim().toLowerCase() === "exit") { rl.close(); return; }
    try {
      console.log("\nBot: " + (await beantworteFrage(frage)));
    } catch (err) {
      console.error("Fehler:", err.message);
    }
    frageLoop();
  });
}
frageLoop();
