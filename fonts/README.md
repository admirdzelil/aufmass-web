# Lokale Fonts

Der Legacy-Prototyp referenziert Google Fonts `Syne` und `Barlow`.
Für die neue Vite-App wird kein Google-Fonts-CDN geladen.

Blockiert bis die echten Fontdateien vorhanden sind:

- `Syne-VariableFont_wght.woff2`
- `Barlow-Regular.woff2`
- `Barlow-SemiBold.woff2`
- `Barlow-Bold.woff2`

Sobald diese Dateien vorliegen, werden sie hier abgelegt und per `@font-face` in `src/styles.css` eingebunden.
Bis dahin nutzt die neue App lokale System-Fallbacks.
