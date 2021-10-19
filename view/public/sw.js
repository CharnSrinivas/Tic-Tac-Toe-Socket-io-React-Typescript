const cache_name = 'cache-v1'
const static_files = [
    'index.html',
    'logo.png',
];
const CACHE_LIMIT = 35;

function limitCache(limit, cache_name) {
    caches.open(cache_name).then((cache) => {

        cache.keys().then(cache_keys => {

            if (cache_keys.length > limit) {
                cache.delete(cache_keys[0]).then(() => {
                    limitCache(limit, cache_name);
                })
            } else { return; }
        })
    })
}

function fetchAndAddtoCache(event) {
    return fetch(event.request).then(fetch_res => {
        let res_copy = fetch_res.clone();
        caches.open(cache_name)
            .then(cache => {
                cache.put(event.request.url, res_copy);
                limitCache(CACHE_LIMIT, cache_name);
            })
    })
}


function fetchHandler(event) {
    return caches.match(event.request)
        .then((cache_res) => {
            //? To refresh the cache item 
            //? Performance may decreases
            if (cache_res)
                return cache_res;
            else {
                fetch(event.request).then(fetch_res => {
                    return caches.open(cache_name).then(cache => {
                        cache.put(event.request.url, fetch_res.clone());
                        return fetch_res;
                    })
                })
            }
        })
}

self.addEventListener(
    'install', (event) => {
        console.log('fuck');
        event.waitUntil(
            caches.open(cache_name).then((cache) => {
                cache.addAll(static_files);
            }).then(() => self.skipWaiting())
        )
    }
)
self.addEventListener(
        'fetch', (event) => {
            event.respondWith(async function() {
                console.log(event);
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) return cachedResponse;
                return fetch(event.request).then(() => updateCache(event.request));
            }());
        }
    )
    //
function updateCache(request) {
    // return (null)
    return caches.open(cache_name).then(cache => {
        return fetch(request).then(response => {
            const resClone = response.clone();
            if (response.status < 400)
                return cache.put(request, resClone);
            return response;
        }).catch(e => { console.log(e); });
    });
}