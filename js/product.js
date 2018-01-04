function Product(details,id){
	this.name = details.name;
	this.additional = details.additional;
	this.category = details.category;
	this.images = details.images;
	this.description = details.description;
	this.options = {}
	this.sizes = details.sizes
	this.colours = details.colours
	this.id = id
	this.form = ''
	this.price = details.price
	this.title = function() {
		var heading = createDOM('h4');
		heading.innerHTML=this.name;
		return heading;
	}
				
}

function imageCache(image) {
	var storage =localStorage.getItem('cacheImages')
	if(!storage) {
		localStorage.setItem('cacheImages','')
		localStorage.setItem('cacheLifeTime', new Date().toString())
	} 
	storage+=image+';'
	localStorage.setItem('cacheImages',storage)
}

function getCached(image) {
	var item = false
	var storage = localStorage.getItem('cacheImages')	
	if(storage) {
		var date = new Date()
		var oldDate = new Date(localStorage.getItem('cacheLifeTime'))
		var diff = (date-oldDate)/1000
		if(diff>3600) {
			localStorage.setItem('cacheImages','')
			localStorage.setItem('cacheLifeTime', new Date().toString())				
		}
		if(storage.indexOf(image)>=0) {
			item =  true
		} else {
			item =  false
		}
	}
	return item
}
//abstracted larger methods to prototype
Product.prototype.gallery = function() {
	var galleryList=[];
	//to resolve problems with scope when nesting functions
	var that = this;
	
	this.images.forEach(function(image){
		var imageLoaded = new Image();
		if(!getCached(image)) {
			imageCache(image)
			// https://www.youtube.com/watch?v=3ONDKqoh6to
			imageLoaded.src='img/loading.gif';
			imageLoaded.setAttribute('data-id',image)
		} else {
			imageLoaded.src=image;
		}
		//using promises to ensure a result
		var p = new Promise(function(resolve, reject) {
			imageLoaded.addEventListener('load', function(event){
				event.preventDefault()
				imageLoaded.setAttribute('alt',"");
				resolve(imageLoaded);
			})
			imageLoaded.addEventListener('error', function(event){
				event.preventDefault()				
				reject('Failed to load');
			})
		}).then(function(result){
			return result;
		//https://stackoverflow.com/questions/42460039/promise-reject-causes-uncaught-in-promise-warning
		}).catch(function(error){
			return ('error caught: ',error);
		})
		//push the promise to the array
		galleryList.push(p);
	})
	return galleryList;
}

Product.prototype.makeGallery = function() {
	var section = createDOM('section');
	var title = createDOM('h4');
	title.innerHTML = this.name;
	var figure = createDOM('figure');
	//binding the function here to allow additional parameters to be sent. 
	// when bound, the dom object sent is bound to actual dom object rendered on screen. nice.
	
	this.changeImage = changeImage.bind(this,figure)
	var caption = createDOM('figcaption');
	var thumbCaption = createDOM('figcaption');
	caption.innerHTML = this.name+'. Click to enlarge';
	thumbCaption.innerHTML = this.name+' Thumbs';
	//https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
	var figThumbs = createDOM('figure');
	//use .then to get resolved promise data
	var galleryList = this.gallery();
	galleryList.forEach((pic,index)=>{
		pic.then(picture=>{
			picture.setAttribute('data-ref',index)
			if(!index) {
				picture.addEventListener('click',largeImage);
				figure.appendChild(picture);
				
			} else {
				// https://www.gamiss.com/hoodies-11571/product949058/ nice mouseover image change
				picture.addEventListener('mouseover',this.changeImage);
				picture.addEventListener('click',this.changeImage);
				figThumbs.appendChild(picture);
			}
			figure.appendChild(caption);
			figThumbs.appendChild(thumbCaption)
			
		});
	});
	section.appendChild(title);
	section.appendChild(figure);
	section.appendChild(figThumbs);
	return section;
}

Product.prototype.getDescription = function () {
	var section = createDOM('section');
	var title = createDOM('h4');
	title.innerText='Description';
	var desc = createDOM('p');
	desc.innerHTML=this.description;
	section.appendChild(title);
	section.appendChild(desc);
	return section;
}

Product.prototype.getAdditionalInfo = function () {
	var section = createDOM('section');
	var heading = createDOM('h4');
	heading.innerText='Additional Information';
	var ul = createDOM('ul');
	this.additional.forEach(listItem=>{
		var li = createDOM('li');
		li.innerHTML=listItem;
		ul.appendChild(li);
	})
	section.appendChild(heading);
	section.appendChild(ul);	
	return section
}

Product.prototype.displayItem = function() {	
	var showItems = document.getElementById('products');
	var container = createContainer(this.category);
	var additional = this.getAdditionalInfo();
	var description = this.getDescription();
	var gallery = this.makeGallery();
	var options = addToCartForm(this)
container.id = this.id
	container.appendChild(gallery);
	container.appendChild(options);
	container.appendChild(description);
	container.appendChild(additional);
	return container
}

function createContainer(category) {
	var container= createDOM('section');
	var heading = createDOM('h3');
	heading.innerText=category;
	if(!document.getElementById(category)) {
		container.id = category
	}
	container.appendChild(heading);
	return container;
}



