function swiper(imageList,event) {
	window.addEventListener('touchcancel',touchCancelled);
	window.addEventListener('touchend',endedSwipe);
	var startingPoint = event.changedTouches[0];
	window.addEventListener('touchmove',movingTouch);
	var movement,direction;


	function movingTouch(event) {
		var movingPoint = event.touches[0];
		movement = movingPoint.screenX  - startingPoint.screenX;
		event.target.style.position='absolute';
		event.target.style.top = '6px';
		if(movement>10) {
			direction = -1;
			event.target.style.left = movement+'px';
		} else if (movement<-10) {
			direction = 1;
			event.target.style.left = movement+'px';		
		}
	}

	function touchCancelled(event) {
		window.removeEventListener('touchcancel',touchCancelled);
		window.removeEventListener('touchend',endedSwipe);
		window.removeEventListener('touchmove',movingTouch);
		event.target.style.left=0;
		// alert('touch canned')
	}
	function endedSwipe(event) {
		// https://www.abeautifulsite.net/working-with-html5-data-attributes
		var image = event.target;
			if(Math.abs(movement)>80) {
				var imageRef = parseInt(image.dataset.ref,10);
				image.style.transition='none';
				if(movement<0) {
					image.style.left = window.innerWidth+'px';
				} else {
					image.style.left = -window.innerWidth+'px';
				}
				if(imageRef+direction===-1) {
					imageRef = imageList.length-1;
					 newRef = imageRef;
				} else if(imageRef+direction===imageList.length) {
					imageRef = 0;
				 } else {
					 imageRef = imageRef+direction;
				}

				for(var x = 0;x<imageList.length-1;x++) {
					var xRef = parseInt(imageList[x].dataset.ref,10);			
					if(xRef===imageRef) {					
						swapImages(imageList[x],image);
					}
				}
		}
		setTimeout(function(){
			image.style.transition='';
			image.style.left = '6px';
			image.style.top = '6px';
		},150)
		window.removeEventListener('touchcancel',touchCancelled);
		window.removeEventListener('touchmove',movingTouch);
		window.removeEventListener('touchend',endedSwipe);
	}
}


function changeImage(target,e){
	if(!e) {
		//going up and down the dom tree.. for ie.
		var moveTo = target.target.parentNode.parentNode.childNodes[1].childNodes[0];
		var change = target.target;
		swapImages(moveTo,change);
	} else {
		// var largerImage = e.target.parentNode.parentNode.childNodes[1].childNodes[0];	
		//changed the function by binding it to the class and sending the target value,
		// received as the first argument to the function.
		swapImages(target.childNodes[0],e.target);
	}
}

function swapImages(larger,smaller) {
	var largerImage = larger;
	var smallImage = smaller;
	// https://stackoverflow.com/questions/10716986/swap-2-html-elements-and-preserve-event-listeners-on-them
	var largerImageSrc = largerImage.src;
	
	if(largerImage.dataset) {	
		var largerImageRef = largerImage.dataset.ref;
		largerImage.dataset.ref = smallImage.dataset.ref;
		smallImage.dataset.ref = largerImageRef;
	}

	largerImage.src = smallImage.src;
	smallImage.src = largerImageSrc;
	

}

function largeImage(e){
	e.target.removeEventListener('click',largeImage);
	var smallerImage = e.target;
	var section  = document.createElement('section');
	var sectionInner = section.cloneNode();
	section.setAttribute('class','largeImage');
	var placeNode = e.target.parentNode;
	var image = e.target.cloneNode();
	var replaceImageNode = placeNode.parentNode.childNodes[2].childNodes;

	if(swiper) {
		this.swiper = swiper.bind(this,replaceImageNode);
		image.addEventListener('touchstart',this.swiper,{passive:true});
	}
	sectionInner.appendChild(image);
	section.appendChild(sectionInner);
	placeNode.appendChild(section);
	section.addEventListener('click',function(e){
		e.preventDefault()
		smallerImage.src = image.src;
		// smallerImage.dataset.ref = image.dataset.ref
		smallerImage.addEventListener('click',largeImage);
		if(swiper) {
			image.removeEventListener('touchstart',this.swiper);		
		}
		section.classList.add('remover')
		setTimeout(function(){
			placeNode.removeChild(section);
		},400);
	})

}

window.onload =function() {	

	if(!isIe()) {

		//load the Product constructor function as script tag to document body if featureset test passes.
		//reason: ie and some other browsers don't recognise promises and error out if the script is within this file. 
		//this resolves the problem
		loadScript('product');

		//generate a try, set it at 1, for first run.
		var trys = 1;
		var noOfTries = 100;
		//if Product is not a function and we haven't tried noOfTries times
	
		// var loadTimer = getTiming({reason:'Product loading'})
		if(typeof(Product)==='undefined') {
			//iife starts
			(function(startRunner){
				//set an interval on the window
				var thing  = window.setInterval(function() {
					//add to the trys
					trys +=1;
					//is Product a function?
					if(typeof(Product)==='function'||trys>=noOfTries) {						
						//if so, start, using the callback function passed into iife
						if (trys<noOfTries) {						
							// loadTimer({reason:'Product is loaded after '+trys+' tries'})
							startRunner();
							// if enough attempts have been made and still no Product function
						} else {
							// loadTimer({reason:'Tries maxed after '+trys+' tries'})
							// window.location.reload()
							// last resort measure. cache will pick up file immediately. 
						}
						//and clear the window interval 
						window.clearInterval(thing);
					}			
				}, 30*trys); //30 ms delay between tries
			})(start);// that last bubble () allows the programmer to send a callback function to the iife.  It might serve other purposes too. 
		}
	}	else {
		loadScript('iescripts');		
		//todo - might have to start looking into this one later. no problems encountered yet.. 
		setTimeout(startIe,0);
	}
}

//loads the requested script link and adds to end of DOM body
function loadScript(which ='') {
	var script = createDOM('script');
	// type not needed (W3C html validator)
	// script.type = 'text/javascript';
	script.src = './js/'+which+'.js';
	document.getElementsByTagName('body')[0].appendChild(script);
}

//get all the stock from the json data file
function start(){
	getStock('products',receiveStock)
	var showItems = document.getElementById('products');
	var a = document.getElementsByTagName('article')[0];
	var article = a.cloneNode(true);
	// showItems.innerHTML='';
	function receiveStock() {	
		// this to that.. 
		var products = this;
		//or arrow function to save context. 
		window.addEventListener('hashchange',function(){
			changeLogo();
			var mainNav = document.getElementById('categories');
			var NavExpanded = mainNav.hasAttribute('class','expanded');
			if(NavExpanded) {
				mainNav.removeAttribute('class','expanded');
			}					
			getContent(products,window.location.hash);			
			showItems.appendChild(article);
		})
		//get content once items and options are loaded
		getContent(this,window.location.hash);	
		showItems.appendChild(article);
	}		
}

function startIe() {
	//receiveStock function  is scoped 
	//means this receiveStock function isn't the same as the one declared above
	//even though they share the same name.
	getStock('products',receiveStock)
	function receiveStock() {	
		var that = this;
		window.addEventListener('hashchange',function(){		
			getItemsForIe(that,window.location.hash);		
		})
		getItemsForIe(this,window.location.hash);
	}
}



function getContent(items,hash) {
	var showItems = document.getElementById('products');
	var crumb = document.getElementsByClassName('breadcrumb')[0];
	//default hash is #products for all products.
	if(hash&&hash!=='#products') {
		showItems.innerHTML='';
		var pageTitle = createDOM('h2');
		pageTitle.innerHTML = 'Products';
		showItems.appendChild(pageTitle);					
		var category = hash.split('#')[1];
		// not supported by safari :(
		// crumb.lastElementChild.innerText=category
		var breadcrumbTitle = createDOM('span');
		breadcrumbTitle.setAttribute('itemprop','title');	
		breadcrumbTitle.innerHTML=category;

		crumb.childNodes[5].innerHTML='';
		crumb.childNodes[5].appendChild(breadcrumbTitle);	
		if(!category) {
			//if category is not found				
			// window.location.

			// window.location.assign(window.location.host+'/category.html')
			// window.location.assign('/category.html')
			return
		}
		//if the hash is of length 2 it could be a product id
		//this doesn't catch two letter words.. may be worth changing
		if(category.length===2) {
			var item = category.split('');
			try{
				var itemCategory = items[Object.keys(items)[parseInt(item,10)]];
				var finalItem = itemCategory.inventory[parseInt(item[1],10)];
			}catch(err) {
				showItems.appendChild(document.createTextNode('no product found'));
			}
			finally{
				if(finalItem) {
					var product = new Product(finalItem,category);
					breadcrumbTitle.innerHTML=product.name;
					var titleWidth = (breadcrumbTitle.getBoundingClientRect().width+20)+'px';
					breadcrumbTitle.parentNode.style.width=titleWidth;
					//everything product related is now abstracted to Product prototypes
					//including displayItem. 
					showItems.appendChild(product.displayItem())
				}
			}
		} else if(!items[category]) {
			
			//for ie		
			try{
				items = JSON.parse(items);
			} catch(err) {
				//if it's already a json file
			}
			finally {			
				var matchingStock = [];
				for(item in items) {
					var itemList = items[item].inventory.filter(function(stock){
						var catName = category.split('-').join(' ')
						return (stock.name.toLowerCase()).indexOf(catName)>-1;
					})
					if(itemList.length) {
						matchingStock.push(...itemList);
					}
				}
				if(matchingStock.length) {
					matchingStock.map(function(item,id) {		
						var product = new Product(item,id).displayItem();
						showItems.appendChild(product);
					});
				}
			}
		} else {
			items[category].inventory.map(function(item,id) {		
				var product = new Product(item,id).displayItem();
				showItems.appendChild(product);
			})
		}
		
	} else {
		crumb.childNodes[5].innerText='All';	
		showItems.innerHTML='';
		var pageTitle = createDOM('h2');
		pageTitle.innerHTML = 'Products';
		showItems.appendChild(pageTitle);					
		Object.keys(items).map(function(key,index){			
			items[key].inventory.map(function(item,id){						
				var productID = id.toString()+index.toString();
				var product = new Product(item,productID).displayItem();
				showItems.appendChild(product);
				
			});
		});
	}
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop
	//dealing with dynamic offsets
	if(window.innerWidth>560) {	
		var moveHeight = document.getElementById('products').offsetTop;
		window.setTimeout(function(){
			window.scrollTo(0,0);
			window.scrollTo(0,moveHeight);
			
		},0);
	}
	
	var basket = JSON.parse(localStorage.getItem('basket') )
	if(basket) {
		var shoppingCart = document.getElementById('cartcontents');
		shoppingCart.innerHTML='';
		populateShoppingBasket();
	}
	
}	

// construct radio selection options for forms
// takes single item options (item), list of available options (options), 
// size or colour as string(name), product ID as string(id)
// returns a fieldset of option buttons and labels 

function radioSelections (item,options,name,id) {
	var fieldset = createDOM('fieldset');
	var legend = createDOM('legend');
	legend.innerHTML = name;
	fieldset.appendChild(legend);
	if(item && item.length) {
		for(var i = 0;i<item.length;i++) {

			var val = item[i];
			var lOption = options[val].toLowerCase();
			var option = createDOM('input');
			var label = createDOM('label');
			option.type = 'radio';
			option.id = lOption+name+id;
			option.value = lOption;
			if(!i) {
				// option.setAttribute('checked','true')
			}
			option.setAttribute('name',name);
			
			label.setAttribute('for',option.id);
			label.innerHTML=options[val];

			fieldset.appendChild(option);
			fieldset.appendChild(label);
		}
	}
	return fieldset;
}

// returns a textarea in a fieldset
function notesEntryBox(id) {
	var fieldset = createDOM('fieldset');
	fieldset.classList.add('notes');
	var legend = createDOM('legend');
	legend.innerText = 'Notes';
	var label = createDOM('label');
	label.setAttribute('for','comments'+id);
	label.innerHTML = 'notes';
	var textarea = createDOM('textarea');
	textarea.id = 'comments'+id;
	textarea.setAttribute('name','comments');
	textarea.setAttribute('id','comments'+id);
	fieldset.appendChild(legend);
	fieldset.appendChild(label);
	fieldset.appendChild(textarea);
	return fieldset;

	// 	<fieldset class="notes">
}

// returns the order size,  colour and notes entered in the form
//https://code.lengstorf.com/get-form-values-as-json/
function getOrderEntries(detail) {
	var info = [];
	if(detail.type==='radio' && detail['checked']) {		
		info.push(detail.name);
		info.push(detail.value);
} else if(detail.type!=='radio'){
		if((detail.type==='textarea'||detail.type==='hidden')&&detail.value!=='') {
			info.push(detail.name); 
			info.push(detail.value);
		}	
	}
	return info;
}

function getFormDetails(event) {	
	event.preventDefault();
	var orderInfo={};
	orderInfo.qty = 1;
	items = event.target.parentNode.elements;
	for(var i = 0; i<items.length;i++) {
		orderItem = getOrderEntries(items[i]);
		if(orderItem.length) {
			orderInfo[orderItem[0]] = orderItem[1];
		}		
	}
	if (!orderInfo.colour) {
		openAlert('colour');	
	} else if(!orderInfo.size) {
		openAlert('size');
	} else {	
		storeBasket(orderInfo);
		openAlert('added',orderInfo);
	}

}


//todo make this a universal alert box. 
function openAlert(message,order) {
	var timeDelay = 2000;
	var messages = {
		colour:'please select a colour',
		size:'please select a size'
	};
	var alertBox = createDOM('section');
	if(order) {
		messages.added='Added '+order.garment+' to basket';
		timeDelay = 1200;
//		alertBox.style.height = '100vh'
	}
	alertBox.id='alertBox'
	alertBox.innerHTML = messages[message];
	document.body.appendChild(alertBox);
	if(order) {
		alertBox.classList.add('success');	
		}	else {
				alertBox.classList.add('warning');
		}	
		window.setTimeout(function() {
		document.body.removeChild(alertBox);
		if(order) {
			var basket = document.getElementById('shoppingcart');
			basket.classList.add('expanded');
			basket.focus();
			var currentHeight = window.scrollY;
			window.addEventListener('scroll',removeExpand.bind(this,currentHeight));	
		}
	},timeDelay);
	return;
}

//store updated basket in localstorage
function storeBasket(orderInfo) {
	var date = new Date().toString();
	orderInfo.date = date;
	var basket = localStorage.getItem('basket');
	if(basket) {
		basket = JSON.parse(basket);
		for(var j = 0;j<basket.length;j++ ) {
			//only add a qty if everything else is the same. 
			//including comments. 
			var basketRules=
			basket[j]['garment']===orderInfo.garment&&
			basket[j]['comments']===orderInfo.comments&&
			basket[j]['size']===orderInfo.size&&
			basket[j]['colour']===orderInfo.colour;

			if(basketRules) {
				basket[j].qty+=1;			
				orderInfo=false;
			}
		} 
		if(orderInfo) {
			basket.push(orderInfo);
		}
		localStorage.setItem('basket',JSON.stringify(basket));			
	} else {
		localStorage.setItem('basket',JSON.stringify([orderInfo]));
	}
	populateShoppingBasket()
}

function addToCartForm (item,selectSize) {
	var section = createDOM('section');
	var title = createDOM('h4');
	var producthiddenfield = createDOM('input');
	var priceHiddenField = createDOM('input');
	var form = createDOM('form');
	
	title.innerHTML='Product Options';
	
	producthiddenfield.type = 'hidden';
	producthiddenfield.setAttribute('name', 'garment');
	producthiddenfield.value = item.name;
	priceHiddenField.type = 'hidden';
	priceHiddenField.setAttribute('name', 'price');
	priceHiddenField.value = item.price;
	
	form.appendChild(producthiddenfield);
	form.appendChild(priceHiddenField);
	
	section.appendChild(title);
	section.appendChild(form);
	var that = item;
	getStock('options',receivedOptions);
	function receivedOptions() {
		var sizeOptions = this.sizes;
		var colourOptions = this.colours;
		if(isIe()) {
			var options =  JSON.parse(this);
			sizeOptions = options.sizes;
			colourOptions = options.colours;		
		}	
		var sizes = radioSelections(that.sizes,sizeOptions,'size',that.id);

		if(selectSize) {
			Array.from(sizes.querySelectorAll('input')).forEach(function(item){
				if(item.value===sizeOptions[selectSize].toLowerCase()) {
					item.setAttribute('checked','true');
				}				
			});
		}

		var colours = radioSelections(that.colours,colourOptions,'colour',that.id);
		var notes = notesEntryBox(that.id);
		var submit = createDOM('input');
		var price = createDOM('div');
		price.classList.add('productprice');
		price.innerHTML = '£'+item.price;			
		// http-server doesn't support POST requests. 
		// https://github.com/indexzero/http-server/issues/172
		// this will work on live web server and results in cleaner url and 
		//form method POST is a more secure experience for user.

		// submit.setAttribute('formmethod','POST')

		submit.setAttribute('type','submit');
		submit.setAttribute('value','Add to Cart');
		submit.addEventListener('click',getFormDetails);

		form.appendChild(colours);
		form.appendChild(sizes);
		form.appendChild(notes);
		form.appendChild(price);
		form.appendChild(submit);
	}
	return section;
}

