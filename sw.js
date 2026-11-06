// Atualização v3: remove somente caches desta aplicação e desativa o worker v2.
// Não altera localStorage nem outros caches do domínio.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('central-financeira-evolucao-')).map(k=>caches.delete(k)));
 await self.registration.unregister();await self.clients.claim();
})()));
