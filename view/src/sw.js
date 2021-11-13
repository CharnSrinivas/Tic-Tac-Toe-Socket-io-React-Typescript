const static_assets =[
    require('./assets/fonts/ComicNeue-Regular.ttf').default,
    require('./assets/fonts/ComicNeue-Bold.ttf').default,
    require('./assets/icons/back_arrow.svg').default,
    require('./assets/player-icons/o.svg').default,
    require('./assets/player-icons/x.svg').default,
    require('./assets/sounds/move.ogg').default,
    require('./assets/sounds/player_join.ogg').default
]
const cache_name = 'cache-v1';

const static_files = [
    '/',
    '/static/js/bundle.js',
    '/static/js/vendors~main.js',
    '/static/js/bundle.chunk.js',
    '/static/js/main.chunk.js',
    '/logo.png',
    ...static_assets
];
const self = this;

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
    console.log(event);
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) { console.log("Cached Response");; return cachedResponse; }
    //? Do offline and no-cache stuff
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