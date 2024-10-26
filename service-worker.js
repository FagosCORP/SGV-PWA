const CACHE_NAME = 'pwa-sga-app-cache-v1';

const urlsToCache = [
  '/',
  '/src/index.html',
  '/css/style.css', 
  '/image/icon.png', 
];

// Evento de instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
          .catch((error) => {
            console.error('Falha ao armazenar um ou mais recursos:', error);
          });
      })
  );
});

// Evento de ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          // Atualiza o cache com a nova resposta
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
      .catch(() => {
        // Se offline, você pode retornar uma página de fallback ou um ícone
        console.error('Erro ao buscar o recurso:', event.request.url);
      })
  );
});

