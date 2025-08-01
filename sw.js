self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('kasargod-v1').then(cache => {
            return cache.addAll(['index.html', 'dramatic.mp3', 'phrase1.mp3', 'phrase2.mp3']);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});