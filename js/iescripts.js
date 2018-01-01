function getItemsForIe(items,hash) {
	var cat = hash.split('#')[1]
	items = JSON.parse(items)
	var main = document.getElementById('products')
	main.innerHTML=''
	if(cat&& cat!=='products'){
		var finalHeight = document.getElementById('products').offsetTop
		for (var i = 0; i < items[cat].length;i++) {
			var g = new Product(items[cat][i],i)
			var section = createSection([g.gallery,g.description],'Title')
			section.appendChild(g.options)
			main.appendChild(section)
			// main.appendChild(g.description)
			
			// getGallery(items[cat][i])
			window.scrollTo(0,finalHeight)
		}
	} else  {
		Object.keys(items).map(function(category,cat) {
			items[category].inventory.map(function(item,index){
				var id = cat.toString()+index.toString()
				var g = new Product(item,id)
				var section = createSection([g.gallery,g.description],'Title')
				section.appendChild(g.options)
				main.appendChild(section)
					
			})
		})
	}
	populateShoppingBasket()

}

function Product(item,id) {
	this.id = id
	this.name = item.name
	this.sizes = item.sizes
	this.colours = item.colours
	this.price = item.price
	this.gallery = getGallery(item.images,item.name)
	this.description = getDescription(item.description)
	// this.additional = getAdditional(item.additional)
	this.options = addToCartForm(this)
}
//without prototypes? maybe

function getDescription(description) {
	var sentence = description.split('.')
	var paragraphs = []
	var para = ''
	var p	
	for(var i = 0;i<sentence.length;i++) {
		p = createDOM('p')		
		if(i%2===0) {
			para+=sentence[i]+'. '
		} else {
			if(sentence[i].length>1) {
				para+=sentence[i]+'. '
			}
			p.innerHTML=para
			paragraphs.push(p)
			para=''			
		}
	}

	// var p = document.createElement('p')
	// p.innerHTML=description

	//send as array of description nugs
	var section = createSection(paragraphs,'Description')
	return section
}

function getAdditional(info) {

}


function getGallery(imageSet,name) {
	var thumbs=[]
	var mainImage	
	imageSet.map(function(image,index){
		var img = getDOMImage(image)
		if(!index) {
			img.addEventListener('click',largeImage)
			mainImage = createFigure(img,name)
		} else {
			img.addEventListener('click',changeImage)
			thumbs.push(img)
		}
		// main.appendChild(img)
	})
	thumbs = createFigure(thumbs,name)
	var gallery = createSection([mainImage,thumbs],name+' Gallery')
	return gallery
}

function getDOMImage(image) {
	var img = new Image()
	img.src = image
	img.onload=function(){
		// img.setAttribute('width','auto')
		img.removeAttribute('height')
		img.removeAttribute('width')
	}
	return img
}

function createSection(items,name){
	var section = createDOM('section');	
	var heading = createDOM('h4')
	heading.innerHTML=name
	section.appendChild(heading)
	items.forEach(function(item){
		section.appendChild(item)
	})
	return section
}

function createFigure(image,name) {
	var figure = createDOM('figure');
	var caption = createDOM('figcaption');
	
	if(image.length) {
		caption.innerHTML = name+' thumbs'
		image.forEach(function(item){
			figure.appendChild(item)
		})
		figure.appendChild(caption)
		
	}	else {
		caption.innerHTML = name
		figure.appendChild(image)
		figure.appendChild(caption)
	}
	return figure
}