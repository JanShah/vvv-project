//heavily commented for referencing and learning purposes.

//12% of disabled users still use ie 6, 7 or 8 and 5% are still using 9.  
//https://webaim.org/projects/screenreadersurvey6/#browsers
//The price of progress, not everyone can be catered to.
//https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/
//too small a number of people disable javascript.  
//A form can be tailored to overcome this for a simple cart
//but the enhancements in this project require it for a full experience. a message is displayed for non javascript users.
//this fulfils accessibility guidelines for WCAG 2.0. 
//failures on browsers ie 10 or less spec are not handled. 
//https://msdn.microsoft.com/en-us/library/hh801214(v=vs.85).aspx


//conditional html comments no longer work from ie10 onwards. 
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
//above method will be deprecated
//I will be using a feature check to confirm browser functionality.
//the code is structured to be backward compatible and small (in terms of bandwidth and resource usage) on the browser. 
//using shared functions, the script will be less verbose whilst offering more choices to the programmer for feature 
// (browser) specific scripts.
//it is designed to be at least a minimally functioning shopping cart
//with the ability to browse products, add to cart and checkout
//browsing products includes identifying and studying each image in the gallery in detail, 
//viewing the description and additional information clearly
//shopping cart includes product options (size and colour)
//and optional notes for the seller.

//rules of the project, no libraries or frameworks
//this means>
//1. no react etc
//2. no bootstrap etc
//3. no php 

//javascript skills used in this project: 
//functions
//function declaration, variable function declaration 

//iife, constructor, prototypes, apply
//map, sort, for, forEach
//splice, match
//if/else if/else
//typeof, indexOf,
//setInterval,setTimeout
//event handlers>
	//click, hashchange, onload, touch (start, move, cancel, end)
//promises, callbacks
//XMLHTTPRequest
//DOM >
	//createElement,getElementByID,getElementsByClassName,getElementsByTagName
	//appendChild, childNodes, parentNodes, cloneNode, innerText, innerHTML, tBodies, nodeName, remove
	//getAttribute, querySelectorAll
//Data Types>
	//float, string, array, JSON Objects, Boolean, constructor objects, DOM Objects
//this context, variable scoping, nested functions

// https://webaim.org/techniques/javascript/
// JavaScript Reliance
// It is a common misconception that people with disabilities don't have or 'do' JavaScript, 
// and thus, that it's acceptable to have inaccessible scripted interfaces, so long as it is 
// accessible with JavaScript disabled. A 2012 survey by WebAIM of screen reader users found 
// that 98.6% of respondents had JavaScript enabled. The numbers are even higher for users 
// with low vision or motor disabilities. In short, people with disabilities will experience 
// scripting, so scripted content must be made natively accessible.

// Accessibility guidelines also require scripted interfaces to be accessible. While WCAG 1.0
// from 1999 required that pages be functional and accessible with scripting disabled, WCAG 2.0 
// and all other modern guidelines allow you to require JavaScript, but the scripted content or 
// interactions must be compliant with the guidelines.


//Issues: 
// serp would be very poor unless ssr was implemented. 
//doesn't work on ipad for some, as yet unknown reason. 
//unsure about all platforms. Tested on windows 10 phone, galaxy s4, iphone 5, 6, 
//note 8, windows 7 browsers (chrome, mozilla, opera, ie 10), windows 10 Edge browser
//galaxy browser (slight issue with large image in gallery)
//some browsers have issue with promises and fall back to ie mode script, but others just fail.. 
//also tested using browserstack but unreliable results 
//(didn't work on iphone 5 or 6, ipad air or galaxy tab on browserstack but live device tests on iphones pass)
//the programming has been done using vscode, with some scratchjs for testing
// **all of it is my own code**.
//many references to MDN, stackOverflow et all. 
//extensive logging of output for debugging and occasional use of breakpoints.
//where I have experimented, 
//I have utilised references, written my own way, to suit the specific needs of the application 
//and my coding style 
//iife below is prime example: 
// var trys = 0;
// (function(cb){
// 	var thing  = window.setInterval(function() {
// 		trys +=1
// 		cb(trys)
// 		if(trys>10) {
// 			window.clearInterval(thing)
// 		}
// 	}, 30*trys)	
// })(callback);

// function callback(things) {
// }
//created in scratchjs, used to ensure loading of alternate script

	// in onload function: 
	//setting a timeout on this context delays the execution of the function. 
		//setting it at 0 simply moves it to the end of the execution stack. 
		//https://johnresig.com/blog/how-javascript-timers-work/
		// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
		//heading: Late timeouts

		//setTimeout(start,0)

		//above code works but not well enough.  it sometimes fails, esp on slow connections 
		//because the associated script hasn't been fully loaded

		//another try to get the imported function.  
		//there is a small delay between main script execution and function readiness in loaded script
	
		//this loop runs an iife with an interval;
		//the iife sets a new execution scope that evaluates the Product function each time the interval runs.
		//and cancels it when the function is loaded. 
		//with standard timeout or interval, this might not happen. 
		//it would run the number of times required before evaluating Product and probably fail. 
		//it would also cause unwarranted delays. 
		
	//about breaking up or combining javascript
	// https://msdn.microsoft.com/en-us/library/cc837190(v=vs.100).aspx
	// 'Do Not Combine Too Much
	// Combining scripts is a balance between download performance and cache performance (memory use)
	// . Download performance is the time that is required in order to download a script from the server. 
	// Cache performance is determined by how long the browser stores the script on the client, and the
	//  amount of memory that the cache requires.'
		//loadScript (in catalog.js)
		//good for learning, but is it really required? 
		//if I just remove promises and solve a minor problem with json in ie, I might save a hundred of lines of code
		//however operating in this way offers lightweight solutions for clients in general. They receive 
		//a selection of scripts that share functions with cart.js but never all the scripts. 

		//test below show performance of loadScript function.  
		//Each script is loaded at varying speed with browser caching disabled
		//a try happens at 30 ms intervals
		//the result is the number of times it took to confirm the script successfully loaded.

		// tested on 'slow 3g' connection (unknown speed): 
			//result: 70 tries 
			//delay: 2101ms

		// tested on 'fast 3g' connection (unknown speed): 
			//result: 20 tries 
			//delay: 602ms

		// tested on 128kb/s: 
			//result: 9 tries 
			//delay: 272ms

		// tested on 256kb/s: 
			//result: 5 tries 
			//delay: 154ms

		// tested on 1mb/s: 
			//result: 4 tries 
			//delay: 121ms

		// tested on 5mb/s+: 
			//result: 2 tries 
			//delay: 49ms

// As a result of testing, I have set the limit on tries to 50. If the script doesn't load after 50 attempts (1500ms), 
//the script will end failed and an alternate function can be run. 

			
//reflection: 
// I think I've constructed a basic shopping cart and I'm happy with the outcome of the development. 
//it took a long time to complete and test all the functionality. 
//accessibility testing was very thorough, using tools that include wave webaim, 
//webaim contrast checker, lighthouse, colour oracle, aXe accessibility testing tool, 
//wave evaluation tool, toptal colour blindness views, achecker
// colour contrast analyzer and constant revisions. 
//performance and app evaluation  was done using: 
//google chrome developer console (all tabs were utilised in some way),
// GTMetrix and lighthouse.
//trying to get it working with IE wasn't easy. 
//I haven't documented functionality yet.  it might be fun trying to make a flowchart for it. I won't try. 
// whilst most of the javacsript and html is heavily commented and shows my technique
//some of the functions haven't been. 
//It's not a major concern, but there is a niggling feeling.

// I really didn't think much about page performance until I saw the lighthouse reports 
// The image lazy loader is definitely the biggest performance enhancement and I'm very pleased 
//with the outcome of it.  up to 90% faster page load for this one enhancement.
//it's not perfect, but the flaw is barely visible and well worth it.(note)
//The total of product images is 1455386 bytes.  212418 bytes is the size of the shirt image set, 
//this means on the products page, load only requires only 6% of the overall bandwidth required for images 
//because only the single set will load above the fold. 

// This might be considered a headless ecommerce store, being that there is no backend. JSON Content could be delivered by REST API

// note: the flaw is that occasionally, on first page load, one or more of the images stay stuck in the loading state. 
//refreshing the page restores it
//service workers allow me to use chrome cache storage to store all the content on the site
//The site is now available offline and can be installed on the app shelf in chrome. 
//service workers are in Working draft stage at W3C, so a cutting edge technology, although not compatible with all browsers. 
//it is confirmed working in chrome, firefox and opera desktop browser.

// https://www.w3.org/TR/service-workers-1/
// found this today.  I would say this development mirrors some of the functionality of headless ecommerce. 
// https://ordercloud.io/headless-ecommerce-guide/


//current features: 
//dynamic product loading from json data file

//lazy load images
//service worker and full site caching (return pages when offline)
//install on android homescreen
//product search with autocomplete
//view all categories
//view products per category
//view all products 
//shopping basket and checkout>
	// add to basket
	//add and remove quantity in basket
// image swap products
//image enlarge
//swipe to change image (touch devices)
//4 layouts based on these widths: above 1200, 1200, 740, 560
//full fluid layout
//no libraries or frameworks. 
//compatible with all major browsers

// secure
// https://observatory.mozilla.org/analyze.html?host=vvv.today
// https://csp-evaluator.withgoogle.com/?csp=https://vvv.today
// https://hstspreload.org/?domain=vvv.today
// https://www.htbridge.com/ssl/?id=dhXDQ6E2
// https://www.ssllabs.com/ssltest/analyze?d=vvv.today

// PCI-DSS Compliant

// Fast,progressive and accessible - near 100 lighthouse scores across the board




//entry point
window.addEventListener('load',function(){
	var header = document.getElementsByTagName('header')[0]
	var searchForm = document.getElementById('topsearchBox')
	var searchData = null
	var productsUrl = window.location.pathname==='/products.html'	
	//use keyup event to get search data
	searchForm.addEventListener('keyup',getSearches,false)
	//header events to expand menu items
	header.addEventListener('click',expandItem,false)
	header.addEventListener('keyup',expandItem,false)
	//add the service works
	addServiceWorker()
	//run the lazy loader
	loadImages()
	if(!isIe()&&productsUrl) {
		// https://stackoverflow.com/questions/2446740/post-loading-check-if-an-image-is-in-the-browser-cache
		//rough implementation of a lazy image loader.  any product image above or below the 'fold' or outside the visible
		//part of a page will not render until it comes into view.
		// feature is not implemented for ie 11- but works in edge. 		
		window.addEventListener('scroll',scrollStart,false);
		window.addEventListener('hashchange',scrollStart);
	}
	
	function getSearches(event){
		//got this partially working, not happy with which event is triggered when I update the cell. 
		//the intention is, you click on the match from the dropdown list and it takes you to that items url. 
		//as it stands, it requires the text box lose focus
		//there doesn't even need to be a submit button but hey ho, there you go. 
		//it works with the submit button as a side effect of the change event listener below
		//which is good I suppose. 
		//pressing the enter button bypasses the event listener. not good.  
		event.preventDefault()
		var list = document.getElementById('aoptions')
		var searchBox = document.getElementById('topsearchBox')
		function callback() {
			// this is the data that will be used to compare against search input
			//parsing stringified data creates a deep copy	
			searchData = JSON.parse(JSON.stringify(this))
			if(isIe()) {
				//for some unknown reason, I have to parse this twice for ie.. 
				searchData = JSON.parse(searchData)				
			}
		}
	
		function changeFormTarget(event) {
			console.log('event')

			var formButton = event.target.parentNode.parentNode.childNodes[11]
			var target = event.target.value			
			Object.keys(searchData).forEach(function(category,index) {
				console.log(target,category)
				searchData[category].inventory.map(function(item,id) {
					if(item.name===target) {
						var finalHash = index.toString()+id.toString()
						// https://developer.mozilla.org/en-US/docs/Web/API/Window/open
						window.open('/products.html#'+finalHash,'_self')
						searchForm.removeEventListener('keyup',getSearches,false)
						event.target.value=''
						return;
					}
				})
			})
		}
		// searchBox.addEventListener('blur',changeFormTarget,false)
		if(event.target.value.length>=0&&!searchData) {
			//before second character is typed in, load the products. 
			getStock('products',callback)
		}
		if(event.target.value.length>0&&searchData) {
			list.innerHTML = ''
			//if there is something loaded in searchdata, browse through.
			Object.keys(searchData).forEach(function(item,key){
				searchData[item].inventory.forEach(function(stock){
					console.log(stock,key)
					var p = createDOM('a')
					var name = stock.name.toLowerCase()
					var image = new Image()
					image.src = stock.images[0]
					image.alt = name
					var search = event.target.value.toLowerCase()
					//if there is a partial match in any word of the product name					
					if( name.indexOf(search)>=0 ) {
						console.log(name.indexOf(search),name,search)
						//create an autocomplete option
						// var option = createDOM('option')
						// option.appendChild(image)
						// option.value = stock.name
						//append it to the DOM						
						p.appendChild(image)
						list.appendChild(p)
					}
				})
			})
		}
	}
})


// https://developers.google.com/web/fundamentals/primers/service-workers/
// https://developers.google.com/web/tools/lighthouse/audits/registered-service-worker
function addServiceWorker() {
	//todo, sort out a caching strategy that works.
	// if('serviceWorker' in navigator) {		
	// 	navigator.serviceWorker.register('../sw.js')
	// 	.then(function(registration) {
	// 		// //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
	// 		// registration.onupdatefound = function(data) {
	// 		// 	// console.log('something changed')
	// 		// };
	// 		console.info('Service worker registered')			
	// 	},function(error) {
	// 		console.error('we got an error',error)
	// })
	// }
}

//use this function to return dom elements
function createDOM(element){
	return document.createElement(element);
}

//function to get execution timing in milliseconds
//rewritten to store the first value, then sum it up and give timings at the end. 
//This is a simple curried function http://homepages.inf.ed.ac.uk/stg/NOTES/node33.html
//I'm not sure if this is an appropriate way to get function timings but seems a logical approach.
function getTiming(log) {
	var date = new Date()
	var log = log
	var startTime = (date.getSeconds()*1000)+date.getMilliseconds()
	console.info(log.reason+'. Log Time(ms) : '+startTime)
	return function endTiming(end) {
		var date = new Date()
		var endTime = (date.getSeconds()*1000)+date.getMilliseconds()
		console.info(end.reason+'. Log Time(ms) :'+endTime)
		console.info('job took: ',endTime-startTime,'ms')
	}
}

//use featureset check to see if browser is capable or an older version of Internet explorer
function isIe() {
	var ie
	if(typeof(Promise)==='undefined') {
		ie = true
	} else {
		ie = false
	}
	return ie;
}

var timer = 0
function scrollStart(event) {
	if(!timer) {
		timer = 1
		if(event&&event.type==='hashchange') {	
			window.addEventListener('scroll',scrollStart,false);
		}
		window.setTimeout(function() {
			timer = 0
			loadImages()
		},100)
	}
}


function loadImages() { 

	//how it works: 
	//on events (load, hashchange or scroll)
	//go through each image that isn't loaded
	//if it isn't, add 1 to count
	//check if the image's top or bottom is inside the window
	// if it is, swap the image src for data-id
	//if count is 0 for that page, remove the event listeners. 
	//perfload images done. So good.

	perfLoadImages()
	function perfLoadImages() {
		var count = 0
		var scrollCount = 0
		var imgs = document.querySelectorAll('img')

		if(imgs.length<4) {
			count=1
		}
		for(var i = 0;i<imgs.length;i++) {
			if(imgs[i].getAttribute('data-id')&&imgs[i].getAttribute('data-id')!=='loaded')	{
				scrollCount+=1
				if(checkImagePageFold(imgs[i])===true) {
					count+=1
					getRealImage(imgs[i])
				} else if(checkImagePageFold(imgs[i])==='stop') {
					break;
				}

			}
		}
		if(!count) {
			if(scrollCount===0) {
				window.removeEventListener('scroll',scrollStart,false);
			}
		} else {
			scrollStart()
		}
	}

	function getRealImage(image) {		
		image.src = image.getAttribute('data-id')
		image.setAttribute('data-id','loaded')		

	}

	function checkImagePageFold(image) {		
		var shouldImageLoad = false
		var pos = image.getBoundingClientRect()		
		//add padding top and bottom so items just ouside range will render. 
		var belowFold = pos.top>window.innerHeight+30
		var aboveFold = pos.bottom<-10		
		if(!(belowFold||aboveFold)) {			
			shouldImageLoad = true
		} if(belowFold) {
			shouldImageLoad = 'stop'
		}
		return shouldImageLoad
	}
}

function expandItem(event) {	
	// only effect valid nodes in header, FORM, ASIDE and NAV
	//https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName
	var node = event.target.nodeName	
	var validSections = 
	node==='FORM'||
	node==='ASIDE'||
	node==='NAV';
	
	var keyedEvent = ( 
		event.type==='keyup' && 
		event.key==='Enter' && 
		validSections===true  )

	var mousedEvent = (	
		event.type==='click' && 
		validSections===true )
	
	if((mousedEvent||keyedEvent)&& 
		event.target.classList.length) {
		event.target.classList.remove('expanded')
	} else if(mousedEvent||keyedEvent){
		event.target.classList.add('expanded')
		var currentHeight = window.scrollY
		window.addEventListener('scroll',removeExpand.bind(this,currentHeight))
		// console.log(this)
		//tried adding this but I think it's a negative user experience. 
		// if(node==='FORM') {
		// 	event.target.childNodes[1].childNodes[2].focus()
		// }
	}
}

function removeExpand(height,event) {
	var removeRule = (window.scrollY>height+150)
	||(window.scrollY<height-150)
	if(removeRule) {
		window.removeEventListener('scroll',removeExpand)
		var expandedItems = document.getElementsByClassName('expanded')
		for(var item = 0; item< expandedItems.length; item++) {
			expandedItems[item].classList.remove('expanded')
		}
	}
}

function getaddMinusButtons(item) {	
	var contents = showBasket(item)
	var buttonTD = table('-') 
	var p = createDOM('p') 
	var removeButton = createDOM('button')
	var addButton = createDOM('button')
	var nodes = contents[0].childNodes
	var qty = parseInt(nodes[1].innerText,10)
	var price = (parseFloat(nodes[2].innerText,10)*qty).toFixed(2)
	var lineTotal = table(price)
	buttonTD.innerText = ''
	nodes[1].innerHTML=''
	p.innerHTML=qty
	nodes[1].appendChild(p)
	removeButton.addEventListener('click',changeOrder)
	addButton.addEventListener('click',changeOrder)
	if(qty>1) {
		removeButton.innerText = '-'
	} else {
		removeButton.innerText = 'x'
	}
	addButton.innerText = '+'
	buttonTD.appendChild(removeButton)

	if(qty<50) {	
		buttonTD.appendChild(addButton)
	} else {
		p = createDOM('p')
		p.innerHTML = 'Max 50'
		buttonTD.appendChild(p)
	}	
	return [buttonTD,lineTotal]
}

function getStock(things,callback) {	
	var xhr = new XMLHttpRequest();
	xhr.open('GET','./data/'+things+'.json');
	xhr.responseType='json';
	//need to set this to a high value to accommodate slow networks	
	xhr.timeout=5000;
	xhr.onreadystatechange=function(){
		//apply the response to 'this' of callback function. 
		if(xhr.readyState===4&&xhr.status===200) {
			callback.apply(xhr.response);	
		}
	}
	xhr.send();
}

function stock(item) {
	var itemStore
	getStock('products',storeProducts)
	function storeProducts() {
		itemStore =  JSON.parse(JSON.stringify(this))
	}
	console.log('this is the item store', itemStore)
	return function(id) {
		console.log('this is the item store', itemStore)
	}
	
}