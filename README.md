# Visuelles Wasserzeichen-Tool

Ein kleines Hilfstool, um Bilder direkt im Browser mit einem sichtbaren Wasserzeichen zu versehen — ohne Server-Upload, alles läuft clientseitig.

## Nutzung

`index.html` im Browser öffnen und:

1. Bild per Drag & Drop oder Dateiauswahl hochladen.
2. Wasserzeichen-Typ wählen (Text oder Logo-Bild) und Text/Schrift/Farbe/Größe/Deckkraft/Rotation einstellen.
3. Position per Voreinstellungs-Buttons wählen oder das Wasserzeichen direkt auf dem Bild verschieben (ziehen). Alternativ als Kachel-Muster über die gesamte Fläche legen.
4. Format (PNG/JPEG) wählen und Bild herunterladen.

## Dateien

- `index.html` – Struktur/Formular
- `style.css` – Layout und Styling
- `script.js` – Bildverarbeitung über `<canvas>`

## Agent: Wohnungssuche Pinneberg

Unter `.claude/agents/wohnungssuche-pinneberg.md` liegt ein Claude-Code-Subagent, der Mietwohnungen in Pinneberg und Umgebung (Rellingen, Halstenbek, Tornesch, Elmshorn, Wedel, Schenefeld, Quickborn, Uetersen …) sucht, Inserate prüft, bewertet und vor typischen Betrugsmaschen warnt.

1. Kriterien in `wohnungssuche/suchprofil.md` eintragen (Budget, Zimmer, Orte, Wünsche).
2. In Claude Code z. B. schreiben: „Nutze den Agenten wohnungssuche-pinneberg und such mir passende Wohnungen.“
3. Die Auswertung landet zusätzlich in `wohnungssuche/ergebnisse/JJJJ-MM-TT.md`.

Der Agent kontaktiert keine Vermieter; er entwirft auf Wunsch nur Anschreiben.
