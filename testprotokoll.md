# Testprotokoll Wissensbasis-Chatbot

Ziel: inhaltliche Qualitätssicherung – antwortet der Bot korrekt, quellentreu und ohne Halluzination?

Testdatum: 12.07.2026 · Wissensbasis: 3 Dokumente (CRM-Tools, IT-Sicherheitszertifizierungen, Wissensmanagement-Tools)

## Testergebnisse

| # | Testfrage | Erwartung | Ergebnis | Bewertung |
|---|-----------|-----------|----------|-----------|
| 1 | Welche CRM-Tools eignen sich für Startups? | Antwort aus CRM-Dokument mit Quelle | Strukturierte, korrekte Antwort (HubSpot, Less Annoying, Capsule, Pipedrive u. a.) mit Quellenangabe | OK |
| 2 | Was kostet das günstigste CRM-Tool? | Preise wörtlich aus dem Dokument, keine Erfindungen | Nannte zuerst Less Annoying CRM (13,95 EUR) als günstigstes, korrigierte sich dann selbst auf die kostenlosen Optionen (HubSpot, Capsule). Preise stimmen mit dem Dokument überein; Antwortaufbau leicht widersprüchlich | OK (mit Anmerkung) |
| 3 | Was heißt ein CRM-Tool? | Ehrlichkeit: Definition steht nicht in den Dokumenten | Bot erklärte transparent, dass die Dokumente keine Definition enthalten, statt eine zu erfinden | OK |
| 4 | Welche Zertifizierungen brauchen Behörden in Deutschland? | Antwort aus Zertifizierungs-Dokument mit Quelle | Korrekte, strukturierte Antwort (ISO 27001 auf Basis IT-Grundschutz, Absicherungsstufen, KRITIS) mit Quelle | OK |
| 5 | Unterschied ISO 27001 vs. BSI IT-Grundschutz? | Korrekte Trennung der Begriffe, quellentreu | Saubere Gegenüberstellung inkl. Hinweis auf die Kombi-Zertifizierung "ISO 27001 auf Basis von IT-Grundschutz" | OK |
| 6 | Welche Wissensmanagement-Tools gibt es? | Antwort aus WM-Dokument mit Quelle | Vollständige Übersicht (Confluence, Notion, Guru, SharePoint u. a.) inkl. Kennzahlen, mit Quelle | OK (Zahlen stichprobenartig gegen Originalquellen geprüft) |
| 7 | Gibt es ein Tool, das CRM und Wissensmanagement kombiniert? | Dokumentübergreifende Antwort, beide Quellen | Bot kombinierte beide Dokumente, identifizierte Zendesk als Überschneidung und kennzeichnete ehrlich, dass keine explizite Kombi-Lösung beschrieben wird; beide Quellen genannt | OK |
| 8 | Was kostet ein Flug nach Tokio? | Ablehnen statt Raten | Bot lehnte korrekt ab – nannte aber trotzdem eine (irrelevante) Quelle, was verwirren kann | OK (mit Mangel, s. Schwäche 3) |
| 9 | Wie ist das Wetter morgen in Bochum? | Ablehnen statt Raten | Bot lehnte korrekt ab; erneut irrelevante Quellenangabe | OK (mit Mangel, s. Schwäche 3) |
| 10 | "CRM" (Ein-Wort-Anfrage) | Sinnvolle Antwort oder Rückfrage | "Dazu finde ich nichts in der Wissensbasis" – falsch, das CRM-Dokument existiert | Mangel (s. Schwäche 1) |
| 11 | Fasse alle drei Dokumente in je einem Satz zusammen | Drei Kurzfassungen, drei Quellen | Bot meldete korrekt, nur zwei Dokumente erhalten zu haben, und fasste diese zusammen – das dritte Dokument wurde vom Retrieval nicht übergeben | Mangel (s. Schwäche 2) |

**Bilanz: 8× OK, 1× OK mit Anmerkung, 2× Mangel – kein einziger Fall von Halluzination.**

## Gefundene Schwächen und Maßnahmen

- **Schwäche 1 – Ein-Wort-Anfragen scheitern:** Das Retrieval filtert Suchwörter mit weniger als 4 Zeichen heraus; "CRM" (3 Zeichen) fällt komplett durch, obwohl ein passendes Dokument existiert.
  → **Maßnahme:** Mindestwortlänge im Retrieval von `> 3` auf `>= 3` gesenkt, damit gängige Abkürzungen (CRM, ERP, BSI, KI) gefunden werden. (Commit: _Hash eintragen_)

- **Schwäche 2 – Übersichtsfragen unvollständig:** Es werden nur die Top-2-Dokumente an das Modell übergeben; bei Fragen über die gesamte Wissensbasis fehlt das dritte Dokument. Positiv: Der Bot hat das transparent gemeldet statt zu erfinden.
  → **Maßnahme:** Anzahl der übergebenen Dokumente von 2 auf 3 erhöht (bei wachsender Wissensbasis: dynamisch je nach Fragetyp). (Commit: _Hash eintragen_)

- **Schwäche 3 – Irrelevante Quellenangabe bei Ablehnungen:** Wenn die Frage nicht beantwortbar ist, nennt der Bot trotzdem das (irrelevante) Retrieval-Dokument als Quelle.
  → **Maßnahme:** Prompt ergänzt: "Wenn die Antwort nicht in den Dokumenten enthalten ist, nenne KEINE Quelle." (Commit: _Hash eintragen_)

- **Anmerkung zu Testfrage 2:** Antwort erst "günstigstes = 13,95 EUR", dann Selbstkorrektur auf kostenlose Optionen.
  → **Maßnahme (optional):** Prompt-Zusatz "Beantworte die Frage direkt und widerspruchsfrei in einem Zug."

## Retest nach Maßnahmen

| # | Testfrage | Ergebnis nach Fix | Bewertung |
|---|-----------|-------------------|-----------|
| 10 | "CRM" | _nach Code-Änderung erneut testen und eintragen_ | |
| 11 | Alle drei Dokumente zusammenfassen | _nach Code-Änderung erneut testen und eintragen_ | |
| 8/9 | Tokio / Wetter | _nach Prompt-Änderung erneut testen: keine Quellenangabe mehr?_ | |

## Bekannte Limitationen

- Stichwort-Retrieval statt semantischer Suche (Embeddings) – bewusste Vereinfachung für den Prototyp; Erweiterungsidee dokumentiert. Folge: Synonyme und Umschreibungen ohne wörtliche Treffer werden nicht gefunden.
- Kein Gesprächsgedächtnis: Jede Frage wird unabhängig beantwortet, Rückbezüge ("und was kostet das zweite?") funktionieren nicht.
- Qualität der Antworten hängt direkt von der Qualität der Wissensbasis ab – Kennzahlen in den Quelldokumenten (z. B. Marktvolumen) wurden bei Erstellung stichprobenartig geprüft.
