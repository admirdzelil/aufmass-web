/*
 * Offline-Betrieb fuer die Baustelle.
 *
 * Auf der Baustelle gibt es kein Netz und keinen Server. Dieser Service Worker
 * legt deshalb alles, was die Anwendung laedt, in einen Zwischenspeicher und
 * bedient spaetere Aufrufe daraus. Nach einem vollstaendigen Durchlauf mit
 * Verbindung laeuft die Anwendung ohne jede Verbindung weiter.
 *
 * Zwei bewusste Entscheidungen:
 *
 * 1. Kein `skipWaiting`, kein `clients.claim`. Eine neue Fassung uebernimmt
 *    erst, wenn die Anwendung geschlossen und neu geoeffnet wird. Ein Programm,
 *    das sich mitten im Aufmass selbst austauscht, waere im Feld unbrauchbar.
 *
 * 2. Zuerst Zwischenspeicher, dann Netz. Auf der Baustelle ist das Netz
 *    entweder weg oder quaelend langsam; Warten auf einen Zeitablauf waere
 *    schlimmer als eine Datei, die einen Tag alt ist. Im Hintergrund wird
 *    trotzdem nachgeladen, solange eine Verbindung besteht.
 */

const CACHE = 'aufmass-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    let cache = null;
    try {
      cache = await caches.open(CACHE);
    } catch {
      // Ohne Zwischenspeicher gibt es keinen Offline-Betrieb — die Anwendung
      // laeuft aber normal weiter, deshalb kein Abbruch.
      return;
    }
    await cache.addAll(SHELL.map((pfad) => new Request(pfad, { cache: 'reload' }))).catch(() => {});
    // Der Bauvorgang legt eine Liste ALLER ausgelieferten Dateien ab. Ohne sie
    // laege nur im Zwischenspeicher, was beim ersten Besuch zufaellig geladen
    // wurde — die PDF-Anzeige und die Excel-Vorlage kommen aber erst bei Bedarf
    // und wuerden auf der Baustelle fehlen.
    try {
      const antwort = await fetch('/offline-dateien.json', { cache: 'reload' });
      const dateien = antwort.ok ? await antwort.json() : [];
      await Promise.all(dateien
        .filter((pfad) => typeof pfad === 'string' && pfad.startsWith('/'))
        .map((pfad) => cache.add(pfad).catch(() => {})));
    } catch {
      // Ohne Liste bleibt es beim Nachladen waehrend der Nutzung; die
      // Anwendung laeuft davon unbeeindruckt weiter.
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const namen = await caches.keys();
    await Promise.all(namen.filter((name) => name !== CACHE).map((name) => caches.delete(name)));
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Seitenaufrufe: immer die gespeicherte Startseite bedienen, sonst steht auf
  // der Baustelle die Fehlerseite des Browsers statt der Anwendung.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      let cache = null;
      try { cache = await caches.open(CACHE); } catch { return fetch(request); }
      try {
        const frisch = await fetch(request);
        await cache.put('/index.html', frisch.clone()).catch(() => {});
        return frisch;
      } catch {
        return (await cache.match('/index.html')) ?? (await cache.match('/')) ?? Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    // Ein defekter oder gesperrter Zwischenspeicher darf die Anwendung nicht
    // lahmlegen: dann wird einfach ohne ihn weitergearbeitet.
    let cache = null;
    try {
      cache = await caches.open(CACHE);
    } catch {
      return fetch(request);
    }
    try {
      const gespeichert = await cache.match(request);
      if (gespeichert) {
        // Im Hintergrund auffrischen, aber niemals darauf warten.
        event.waitUntil(fetch(request).then((frisch) => cache.put(request, frisch.clone())).catch(() => {}));
        return gespeichert;
      }
    } catch {
      return fetch(request);
    }
    const frisch = await fetch(request);
    if (frisch.ok) await cache.put(request, frisch.clone()).catch(() => {});
    return frisch;
  })());
});

/*
 * Die Anwendung meldet nach dem Laden, welche Dateien sie tatsaechlich geholt
 * hat. Damit landen auch nachgeladene Programmteile, Schriften und die
 * Excel-Vorlage im Zwischenspeicher — die tauchen in der index.html nicht auf.
 */
self.addEventListener('message', (event) => {
  const daten = event.data;
  if (!daten || daten.typ !== 'dateien-sichern' || !Array.isArray(daten.urls)) return;
  event.waitUntil((async () => {
    let cache = null;
    try { cache = await caches.open(CACHE); } catch { return; }
    await Promise.all(daten.urls
      .filter((url) => typeof url === 'string' && url.startsWith(self.location.origin))
      .map(async (url) => {
        if (await cache.match(url)) return;
        await cache.add(url).catch(() => {});
      }));
    const clients = await self.clients.matchAll();
    for (const client of clients) client.postMessage({ typ: 'offline-bereit' });
  })());
});
