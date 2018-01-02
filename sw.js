self.addEventListener('install',function(event) {
	var cacheName = 'vvv-app-cache'
	var cacheURLs = [
		'https://fonts.googleapis.com/css?family=Kaushan+Script',
		'/',
		'/manifest.json',
		'/index.html',
		'/contact.html',
		'/checkout.html',
		'/terms.html',
		'/blog.html',
		'/products.html',
		'/js/home.js',
		'/js/catalog.js',
		'/js/checkout.js',
		'/js/product.js',
		'/js/iescripts.js',
		'/js/basket.js',
		'/css/styles.css',
		'/css/fallbackstyle.css',
		'/css/breadcrumb.css',
		'/css/home.css',
		'/css/category.css',
		'/css/checkout.css',
		'/data/options.json',
		'/data/products.json',
		'/logo-sm.png',
		'/img/banner1.jpg',
		'/img/banner2.jpg',
		'/img/banner3.jpg',
		'/img/banner4.jpg',
		'/img/cart.svg',
		'/img/menu.svg',
		'/img/menuHover.svg',
		'/img/search.svg',
		'/img/bgpattern.svg',
		'/img/loading.gif',
		'/img/shirt/beowulf-shirt1.jpg',
		'/img/shirt/beowulf-shirt2.jpg',
		'/img/shirt/beowulf-shirt3.jpg',
		'/img/shirt/beowulf-shirt4.jpg',
		'/img/shirt/shirt1.jpg',
		'/img/shirt/shirt2.jpg',
		'/img/shirt/shirt3.jpg',
		'/img/shirt/shirt4.jpg',
		'/img/breeches/breeches1.jpg',
		'/img/breeches/breeches2.jpg',
		'/img/breeches/breeches3.jpg',
		'/img/breeches/breeches4.jpg',
		'/img/cloak/cloak1.jpg',
		'/img/cloak/cloak2.jpg',
		'/img/cloak/cloak3.jpg',
		'/img/cloak/cloak4.jpg',
		'/img/tunic/tunic1.jpg',
		'/img/tunic/tunic2.jpg',
		'/img/tunic/tunic3.jpg',
		'/img/tunic/tunic4.jpg',
		'/img/tunic/romantunic1.jpg',
		'/img/tunic/romantunic2.jpg'
	]
	//https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
	// The install event is your chance to cache everything you need before being able 
	// to control clients. The promise you pass to event.waitUntil() lets the browser 
	// know when your install completes, and if it was successful.
	event.waitUntil(
		self.caches.open(cacheName)
		.then(function(cache){
				// https://developer.mozilla.org/en-US/docs/Web/API/Cache/keys
				//just looking
				// cache.keys().then(function(item) {
				// 	item.forEach(function(request){
				// 	})
				// })

				return cache.addAll(cacheURLs)
				.then(function(){
					return true	
				})
				.catch(function(error){
					console.log('we have an error: ', error)
				})

				// adding files one at a time for debugging
				// cacheURLs.forEach(function(file){
				// 	cache.add(file)
				// 	.catch(function(error){
				// 		console.error('there is an error here: ',file)
				// 	})
				// })
			})
	)

})
// https://www.youtube.com/watch?v=xvLnmdjgEWY
self.addEventListener('fetch',function(event){
	// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker#cachefallback
	event.respondWith(
		caches.match(event.request).then(function(response) {
			//response is returned if item is not cached.
			return response || fetch(event.request);
		})
		.catch(function(error){
			console.log('there is an error in cache fetching', error)
		})
	);
})