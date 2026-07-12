# Wissensbasis-Chatbot (RAG-Prototyp)

Ein Chatbot, der Fragen **ausschließlich auf Basis einer lokalen
Dokumenten-Wissensbasis** beantwortet – mit Quellenangabe und ohne
Halluzination: Was nicht in den Dokumenten steht, wird ehrlich als
"nicht gefunden" gemeldet statt erraten.

Entstanden als Erweiterung meines [KI-Markt-Recherche-Tools](https://github.com/wijdenham25100/ki-marktrecherche),
dessen Recherche-Ergebnisse hier als Wissensbasis dienen.

## Wie es funktioniert

1. **Retrieval:** Die Frage wird in Suchwörter zerlegt; alle Markdown-Dokumente
   in `wissen/` werden nach Treffern bewertet, die relevantesten werden ausgewählt.
2. **Kontext:** Die ausgewählten Dokumente werden zusammen mit der Frage an die
   Claude API übergeben.
3. **Quellenbindung:** Der Prompt verpflichtet das Modell, nur aus den
   übergebenen Dokumenten zu antworten, die Quelle zu nennen – und bei fehlender
   Antwort ehrlich zu passen (dann ohne Quellenangabe).

## Nutzung

```bash
npm install
# .env mit ANTHROPIC_API_KEY anlegen
node chatbot.js
```

Dann interaktiv Fragen stellen, `exit` zum Beenden.

## Qualitätssicherung

Der Bot wurde mit 11 strukturierten Testfragen geprüft (Normalfälle,
dokumentübergreifende Fragen, Halluzinationsschutz, Robustheit):
siehe [testprotokoll.md](testprotokoll.md).

Ergebnis: keine Halluzinationen; zwei gefundene Schwächen
(Ein-Wort-Anfragen, unvollständiger Kontext bei Übersichtsfragen)
wurden behoben und nachgetestet.

## Bekannte Limitationen

- Stichwort-Retrieval statt semantischer Suche (Embeddings) –
  bewusste Vereinfachung für den Prototyp
- Kein Gesprächsgedächtnis (jede Frage wird unabhängig beantwortet)
- Antwortqualität hängt von der Qualität der Wissensbasis ab

## Erweiterungsideen

- Semantische Suche mit Embeddings statt Stichwort-Matching
- Gesprächskontext über mehrere Fragen hinweg
- Web-Oberfläche statt Konsole
- Automatisierte Regressionstests auf Basis des Testprotokolls

## Tech-Stack

Node.js · Anthropic SDK (Claude API) · Markdown als Wissensformat
