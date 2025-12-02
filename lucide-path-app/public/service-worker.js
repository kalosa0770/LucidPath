self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('lucid-path-cache').then((cache) => {
        return cache.addAll(['/', '/index.html']);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );

    // Listen for push events and show notifications
    self.addEventListener('push', function (event) {
      try {
        const payload = event.data ? event.data.text() : '{}';
        const data = JSON.parse(payload);
        const title = data.title || 'Lucid Path';
        const options = {
          body: data.body || '',
          data: data.data || {},
          icon: '/icons/android-chrome-192x192.png',
          badge: '/icons/android-chrome-192x192.png'
        };
        event.waitUntil(self.registration.showNotification(title, options));
      } catch (err) {
        console.error('push event error', err);
      }
    });

    self.addEventListener('notificationclick', function(event) {
      event.notification.close();
      const data = event.notification.data || {};
      const url = data.url || '/';
      event.waitUntil(clients.openWindow(url));
    });
  });
  