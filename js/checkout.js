window.onload=function() {
	var basket = JSON.parse(localStorage.getItem('basket') )
	if(basket) {
		basket = basket.sort(function(prev,item){
			//sort to meet requirements of project specification (return a list sorted by price)
			return parseFloat(prev.price,10)<parseFloat(item.price,10)
		})
		localStorage.setItem('basket',JSON.stringify(basket))
	}	
	loadCheckout()
}

//very sparse checkout function. nice. 
function loadCheckout() {
	var basket = JSON.parse(localStorage.getItem('basket') )
	var checkout = document.getElementById('subtotals').tBodies[0]
	var subTotalTable = document.getElementById('subtotals').tFoot
	subTotalTable.innerHTML = ''
	var checkoutForm = document.getElementById('checkout')
	checkout.innerHTML = ''
	if(basket && basket.length) {

		basket.map(function(item,index){
			var addminus = getaddMinusButtons(item,index)
			var contents = showBasket(item)
			var lineItem = contents[0]
			lineItem.appendChild(addminus[1])
			lineItem.appendChild(addminus[0])

			lineItem.id = 'line'+index
			checkout.appendChild(lineItem)
			if(contents[1]) {
				checkout.appendChild(contents[1])
			}
		})
		var subtotal = basketSubTotal(true)
		var subtotalText=table('sub Total')
		var subTotalRow = table()
		var subTotalAmount = subtotal.childNodes[0].innerHTML
		subtotal.childNodes[0].setAttribute('colspan','1')
		subtotalText.setAttribute('colspan','4')
		subTotalRow.appendChild(subtotalText)
		subTotalRow.appendChild(subtotal.childNodes[0])
		var totals = addTaxes(subTotalAmount,subTotalRow)
		subTotalTable.appendChild(totals)

		// https://developer.mozilla.org/en-US/docs/Web/API/ParentNode
	} else {
		checkoutForm.parentNode.removeChild(checkoutForm)
		var message = 'Please add something to the shopping cart'
		var section = document.getElementsByTagName('section')[1]
		section.innerHTML =message
	}

}	

function addTaxes(subtotal,row) {
	subtotal = parseFloat(subtotal,10)
	var VAT = 1.2
	var shipping
	if(subtotal>500) {
		shipping = 0
	} else {
		shipping = 5.99
	}
	var vatTotal =  subtotal -( subtotal / VAT )
	subtotal = subtotal - vatTotal
	var finalTotal = vatTotal + subtotal + shipping
	var arr = [subtotal,vatTotal,shipping===0?'FREE!':shipping,finalTotal]
	var table = buildTable(arr,row)
	return table
}

function buildTable(data,row) {
	var titles = ['Sub Total','VAT','Shipping','Total to pay']
	var temp = document.createDocumentFragment()
	data.map(function(item,index){
		var newRow = row.cloneNode(true)
		newRow.childNodes[0].innerHTML = titles[index]

		try{
			newRow.childNodes[1].innerHTML = item.toFixed(2) 
		} catch(err) {
			newRow.childNodes[1].innerHTML = item
		}
		temp.appendChild(newRow)
	})
	return temp
}
