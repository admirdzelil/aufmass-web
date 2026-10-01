# Aufmaß – Webveröffentlichung

Dieses Repository enthält die ausgelieferte Browseranwendung. Der eigene Anwendungscode ist seit 02.10.2026 verschleiert. Die lesbaren Entwicklungsquellen und die Windows-Fassung liegen lokal und werden hier nicht veröffentlicht.

## Aktuellen Stand erstellen

Das getrennte lokale Projekt Programme/Aufmass-Webschutz baut aus unveränderten Desktop-Quellen eine eigene Webfassung. Dort npm run build verwenden. Der Befehl erzeugt ein neues, eindeutig benanntes Prüf-/Veröffentlichungspaket und lädt nichts automatisch hoch.

Nur das getestete candidate-Paket veröffentlichen: assets/, index.html, Icons, Manifest, Service Worker und Offline-Dateiliste. Keine unverschleierten raw-source-/input-Ordner, Quellen, Modulübersichten, Tests, Projektarchive, Lizenzdateien, Schlüssel, Source Maps oder node_modules übernehmen. CNAME und Repo-Konfiguration erhalten. Git-Änderungen nur mit einer ausdrücklichen Dateiliste vormerken. Den normalen Desktop-Build nicht direkt veröffentlichen.

## Browserarbeitsplatz

Kompakte Oberfläche und verbundenes Planfenster; ein Hauptfenster hält die Schreibsperre. Rechts gewählte Pins öffnen Eigenschaften links. Projektstände liegen lokal im Browserprofil (IndexedDB), nicht auf GitHub. Frühere Onlinefenster vor dem Wechsel schließen und ein angebotenes Update übernehmen. Browserdaten nicht löschen.

## Umfang des Schutzes

Eigener Code: unverständliche Bezeichner, RC4-kodierte Zeichenketten und ausgewählte Kontrollflussumformungen. Keine Umbenennung von gespeicherten Datenfeldern oder Fensterschnittstellen. Bibliotheken und öffentliche Katalog-/Vorlagendaten werden nicht zusätzlich verschleiert. Keine Debugger-Endlosschleifen und keine Lockerung der Content Security Policy.

Die bestehende Lizenzprüfung bleibt lokal. Verschleierung erschwert Analyse und Änderungen, verhindert aber weder das Kopieren ausführbarer Dateien noch garantiert sie Schutz gegen Reverse Engineering. Keine serverseitige Fernsperre oder strikte Gerätebindung. Die reguläre Git-Historie wurde am 02.10.2026 auf die aktuelle verschleierte Fassung reduziert. Frühere Kopien, Forks oder GitHub-Zwischenspeicher können dadurch nicht zurückgerufen werden. Zusätzliche serverseitige Zugangskontrolle bleibt ein eigener Schritt.
