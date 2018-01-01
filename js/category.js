
window.onload = function() {

	getStock('products',categories)
}

function categories() {
	var categoryDOM = document.getElementById('category')
	categoryDOM.innerHTML=''
	var article = categoryDOM.childNodes[1]
	var that = this
	if(!isIe()) {
		Object.keys(this).map(function(catname, item, all) {
			var category = new Category(that[catname],item)
			var section = category.getAll
			categoryDOM.insertBefore(section,article)
			// category.appendChild(createDOM('section'))
		})
	}
}



function Category (props,item){
		var itemId = item
		this.title =this.getTitle(props.title)
		this.description = this.getDescription(props.description)
		this.short_description = this.getShortDescription(props['short_description'])
		this.link = this.getLink(props.name)
		this.image = this.getImage(props.image)
		this.getAll = this.section(itemId)
	
}

Category.prototype.section = function(item) {
	var section = createDOM('section')
	section.appendChild(this.title)
	section.appendChild(this.image)
	section.appendChild(this.short_description)
	section.id = item
	return section
}

Category.prototype.getTitle = function(title) {
	var h3 = createDOM('h3')
	h3.innerHTML = title
	return h3
}

Category.prototype.getDescription = function(description) {
	var p = createDOM('p')
	p.innerHTML = description
	return p
}

Category.prototype.getShortDescription = function(description) {
	var p = createDOM('p')
	p.innerHTML = description
	return p
}
Category.prototype.getImage = function(image) {
	var img = new Image()
	img.src = image
	img.alt=image.split(/([/.])/)[4]
	img.onload = function() {
	}
	var link = createDOM('a')
	link.href=this.link
	link.appendChild(img)
	return link
}
Category.prototype.getLink = function(props) {
	var link = 'category.html#'+props		
	return link
}

window.addEventListener('hashchange',viewProducts)

function viewProducts(e) {
	e.preventDefault()
	if(window.location.hash)
	try{
		getStock('products',listOfProducts)
		function listOfProducts() {
			var category = window.location.hash.split('#')[1]
			var itemIndex = Object.keys(this).map(function(item,index) {
				if(item===category) {
					return index
				}
			}).join('').trim()
			var items = getInventory(this[category].inventory,itemIndex)
			category = new Category(this[category],itemIndex)
			var categoryDOM = document.getElementById('category')
			categoryDOM.innerHTML=''
			categoryDOM.appendChild(category.getAll)
			categoryDOM.appendChild(items)

		}
	} catch(error) {
	}
	else 
		getStock('products',categories)
}


function getInventory(stock,id) {
	var outerSection = createDOM('section')
	var backButton = createDOM('button')
	backButton.innerHTML = 'back'
	backButton.addEventListener('click',function(){
	})
	outerSection.classList.add('outer')
	stock.map(function (item,index){
		var section = createDOM('section')
		section.id = id+index.toString()
		var productLink = createDOM('a')
		productLink.href='products.html#'+id+index.toString()
		var listItem = new MiniProduct(item)
		Object.keys(listItem).forEach(function(part){
			section.appendChild(listItem[part])
		})
		productLink.appendChild(section)
		outerSection.appendChild(productLink)
		outerSection.appendChild(backButton)
	})
	return outerSection
}

function MiniProduct(product) {
 	this.name = this.getTitle(product.name)
	this.image = this.getImages(product.images,product.name)
	this.price = this.getDescription(product.price)
}

MiniProduct.prototype.getImages = function(images,name) {
	var figure = createDOM('figure')
	var picture = new Image()
	picture.src = images[0]
	picture.alt = ''
	figure.appendChild(picture)
	var caption = createDOM('figcaption')
	caption.innerHTML = name
	figure.appendChild(caption)
	return figure
}

MiniProduct.prototype.getTitle = function(title) {
	var h4 = createDOM('h4')
	h4.innerHTML = title
	return h4
}

MiniProduct.prototype.getDescription = function(description) {
	var section =createDOM('section')
	section.innerHTML = description
	return section
}

