// create DOM elements
function createDOM(element){
	return document.createElement(element);
}

changeLogo()
// https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet
function changeLogo() {
	var colors = [
		'b4c0b4','274160','2d1747','d35112','9a021a'
	]
	var sheet = document.styleSheets[0]
	var logoParts = ['st1','st2','st0','st3']
	var styles = logoParts.forEach(function(part) {
		var id = Math.floor(Math.random()*colors.length)
		if(part==='st3'&&colors[id]==='b4c0b4') {
			id=1;
		}

		var rule = '.'+part+' {fill:#'+colors.splice(id,1)+'}'
		if(!isIe()&&sheet.rules) {
			sheet.insertRule(rule,sheet.rules.length)
		} else if (sheet.rules){
			//some funny number to make this compatible with ie.  don't ask, I've no idea. 
			sheet.insertRule(rule,sheet.rules.length-112)
			// mozilla uses cssRules
		} else if (sheet.cssRules) {
			sheet.insertRule(rule,sheet.cssRules.length)
			
		}

	})
}

//Get window path 
// optional id = page name or true
// returns true/false for matching path or pathname 
function getPath(id) {
	var path = window.location.pathname
	if(id!==true) {
		return path==='/'+id+'.html'
	} else {
		return path
	}
}

//products.html already populates shopping basket
if(!getPath('products')) {
	populateShoppingBasket()
}

//populate the shopping basket
//takes data from local storage, no arguments 
//populates the DOM with basket info
function populateShoppingBasket() {
	var basket = JSON.parse(localStorage.getItem('basket') ) || []

	var date = new Date()
	var oldDate = new Date(localStorage.getItem('cacheLifeTime'))
	var hours = (date - oldDate)/1000/60/60
	if(hours>1) {
		localStorage.setItem('cacheLifeTime',date.toString())
		basket = []
		localStorage.removeItem('basket')
	}
	var indicator = createDOM('div')
	var cartHeader = document.getElementById('shoppingcart');
	var cart = document.getElementById('cartTotal')
	var lastButton = cartHeader.children[1]
	var message = 'continue Shopping'
	if(lastButton.innerHTML!==message) {
		var button = createDOM('button')
		button.addEventListener('click',function() {
			cartHeader.classList.remove('expanded')
			if(window) {
				var url = window.location.pathname
				var host = window.location.host
				var pUrl = '/products.html'
				if(url===pUrl) {
					window.location.reload();
				} else {
					window.location.assign(pUrl)
				}
			}
		})
		button.innerHTML = message
		cartHeader.insertBefore(button,lastButton)
	}
	var basketLastNode = cartHeader.childNodes[cartHeader.childNodes.length-1]
	var shoppingCart = document.getElementById('cartcontents');
	shoppingCart.innerHTML='Basket is empty'
	cart.innerHTML=''
	if(basket.length) {
		shoppingCart.innerHTML=''
		if(basketLastNode.nodeName!=='DIV'){
			cartHeader.appendChild(indicator)
		}
		basket.map(function(item){
			var shoppingCart = document.getElementById('cartcontents');
			var contents = showBasket(item)
			var buttons = getaddMinusButtons(item)[0]
			var orderTime = new Date(item.date)
			var timeNow = new Date()
			if((timeNow - orderTime)/1000<2) {
				contents[0].classList.add('newItem')
			}
			contents[0].appendChild(buttons)
			shoppingCart.appendChild(contents[0])
			if(contents[1]) {
				shoppingCart.appendChild(contents[1])
			}
		})
		var sub = basketSubTotal(true)
		cart.appendChild(sub)
	} else if (basketLastNode.nodeName==='DIV') {
		basketLastNode.parentNode.removeChild(basketLastNode)
	}
}

// buttons for adding and removing quantity from the shopping basket and checkout
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
		// removeButton.id = ''
		removeButton.innerText = '-'
	} else {
		// removeButton.id = 'deleteItem'
		removeButton.innerText = 'x'
	}
	// addButton.id = ''
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
// gets the basket subtotal
// optional checkout parameter, if true return the DOM
//else append DOM to basket. 
function basketSubTotal(checkout) {
	var basket = JSON.parse(localStorage.getItem('basket'))
	var basketTotal = 0
	var quantityInBasket = 0
	if(basket) {
		basket.map(function(item){
			basketTotal += parseFloat(item.price,10) * parseInt(item.qty,10)
			quantityInBasket+=parseInt(item.qty,10)
		})
		var indicator = document.getElementsByTagName('div')[2]
		var p = document.createElement('p')
		p.innerHTML = quantityInBasket
		indicator.innerHTML = ''
		indicator.appendChild(p)
		var cart = document.getElementById('cartTotal')
		var tr = table()
		var td = table(basketTotal.toFixed(2))
		td.setAttribute('colspan',4)
		tr.appendChild(td)
		if(!checkout) {
			cart.appendChild(tr)
		}
		else {
			return tr
		}
	}
}

// construct the table row for each basket item
function showBasket(order){
	var oParts = table()
	var oNotes = false
	var item = order.garment.concat('( size: ',order.size,', colour: ',order.colour,' )')
	oParts.appendChild( table(item) )
	oParts.appendChild( table(order.qty) )
	oParts.appendChild( table(order.price) )
	var shoppingCart = document.getElementById('cartcontents');
	if(order.comments) {
		oNotes = table()
// todo
		// var comments = comments.
		//filter special characters from input.
		var note = table(order.comments.match(/([\w\d .])/g).join(''))
		
		note.setAttribute('colspan','3')
		oNotes.appendChild(note)
	}
	return [oParts,oNotes]
}

// returns tr or td elements
// optional item is html or text content
function table(item) {
	var bit = 'td'
	if(!item) {
		bit = 'tr'
	}
	bit = createDOM(bit)
	if(item) {
		bit.innerHTML = item
	}
	return bit
}

// changes the quantity in basket or checkout according to input buttons (event target)
function changeOrder(event) {
	var basketItemID = 0
	var target = event.target.parentNode.parentNode
	if(target.id) {
		basketItemID = target.id.split('line')[1]
	} else {
		var cell = 0
		for(var x = 0; x<target.parentNode.childNodes.length;x++) {
			var node = target.parentNode.childNodes[x]
			if(node.childNodes[0].hasAttribute('colspan')) {
				cell-=1
			}
			if(node===target) {
				basketItemID=cell
			}
			cell+=1
		}
	}

	var pm = event.target.innerHTML
	var items = JSON.parse(localStorage.getItem('basket'))
	var item = items[basketItemID]
	if(pm==='-') {
		item.qty-=1
	} else if(pm==='x'){
		items.splice(basketItemID,1)
	} else if(pm==='+'){
		item.qty+=1
	}
	localStorage.setItem('basket',JSON.stringify(items))
	if(getPath('checkout')) {
		loadCheckout()
	}
	populateShoppingBasket()
}
