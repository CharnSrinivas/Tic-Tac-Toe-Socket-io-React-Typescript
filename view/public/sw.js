
const cache_name = 'cache-v1';

const static_files = [
    '/',
    '/static/js/bundle.js',
    '/static/js/vendors~main.js',
    '/static/js/bundle.chunk.js',
    '/static/js/main.chunk.js',
    '/logo.png',
];


self.addEventListener(
    'install', (event) => {
        console.log("installing service work")
        event.waitUntil(async function() {
            const cache = await caches.open(cache_name)
            await cache.addAll(static_files);
            self.skipWaiting();
            console.log("added files ");
        }())
    }
)
self.addEventListener(
        'fetch', (event) => {
            if (event.request.method === 'GET' && !event.request.url.includes('socket.io'))

            { event.respondWith(fetchResponse(event)); }
        }
    )
    //
async function fetchResponse(event) {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {  return cachedResponse; }
    //? Do online and no-cache stuff
    return fetch(event.request)
        .then(res => {
            let res_clone = res.clone();
            if (res.status > 400) { return res; }
            return caches.open(cache_name).then(async(cache) => {
                await cache.put(event.request, res_clone)
                return res
            })
        });

}