const CACHE_NAME = "hanuman-chalisa-v1";

const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",

    "./hanuman ji.jpg",
    "./shree ram ji.jpg",

    "./ram.mp3",
    "./shankhnaad.mp3"
];


// Install Service Worker
self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(ASSETS);

            })
            .then(() => {

                return self.skipWaiting();

            })

    );

});


// Activate Service Worker
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))

                );

            })
            .then(() => {

                return self.clients.claim();

            })

    );

});


// Fetch files from cache when possible
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                // If file is already cached
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise fetch from internet
                return fetch(event.request)
                    .then(response => {

                        // Save a copy in cache
                        const responseClone =
                            response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {

                                cache.put(
                                    event.request,
                                    responseClone
                                );

                            });

                        return response;

                    })
                    .catch(() => {

                        // If offline, return homepage
                        return caches.match(
                            "./index.html"
                        );

                    });

            })

    );

});