self.addEventListener('install',function(event) {
	console.log('installing')
	var cacheName = 'vvv-app-cache'
	var cacheURLs = [
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
				// 	console.log(item)
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