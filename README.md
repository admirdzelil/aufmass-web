# Aufmaß — Veröffentlichung

Dieses Verzeichnis enthält **nur die fertige Anwendung**, keinen Quellcode. Es wird
von GitHub Pages unter `https://aufmass.ib-dzelil.at` ausgeliefert.

Der Quellcode liegt getrennt in `Programme/Aufmaß` und gehört **nicht** hierher:
dort steckt in der alten Programmfassung eine eingebettete Vorlage mit echten
Kundendaten. Dieses Repository darf öffentlich sein, jenes niemals.

## Auffrischen nach einer Programmänderung

Im Projektverzeichnis `Programme/Aufmaß`:

    npm run web

Das baut die Anwendung und schreibt sie hierher. Danach hier:

    git add -A
    git commit -m "Neuer Stand"
    git push

GitHub Pages veröffentlicht innerhalb einer Minute.

## Was die einzelnen Dateien tun

| Datei | Zweck |
|-------|-------|
| `index.html`, `assets/` | die Anwendung selbst |
| `sw.js` | Offline-Betrieb: legt die Anwendung im Gerät ab |
| `offline-dateien.json` | Liste aller Dateien, die dafür abgelegt werden |
| `manifest.webmanifest`, `icon-*.png` | Startsymbol und Name am Home-Bildschirm |
| `CNAME` | die eigene Adresse; ohne diese Datei fällt Pages auf `*.github.io` zurück |
| `.nojekyll` | verhindert, dass GitHub die Dateien nachbearbeitet |
| `robots.txt` | hält Suchmaschinen fern, solange es keine Lizenzprüfung gibt |

## Wichtig

GitHub Pages kennt **keinen Passwortschutz**. Wer die Adresse hat, kann das
Programm benutzen. Solange es keine Lizenzprüfung gibt, ist die Adresse das
einzige Geheimnis — nicht weitergeben. `robots.txt` hält nur Suchmaschinen ab,
keine Menschen.
