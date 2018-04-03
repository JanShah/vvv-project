//customer enters their details : 
//	name: email address: 
// preferences of clothing type
// gender
//price
//size
//output filtered results to dom
var productList = getProducts();

window.onload = function () {
	var form = document.getElementById('advancedSearch');
	if(window.innerWidth>739) {
		window.addEventListener('scroll',fixSearchBar,{passive:true});
	}
	var inputs = Array.from(document.getElementsByTagName('input'));
	inputs.forEach((item,index)=>{
		//ignore the first input field
		if(index) {
			item.addEventListener('change',handleSubmit,{passive:true});
			if(item.type==='range') {
				item.addEventListener('input',handleSliders);
			}
		}		
	});
		handleSliders();
		handleSubmit();
}

function getProducts() {
	var savedSearches = {};
	var allInventory;
	var stock = new Promise(function(resolve) {
		getStock('products',function(){
			allInventory = processSearch(this);
			resolve(this);
		});
	});

	return function (searchData) {
		return stock.then(function(data){
			var result = allInventory(searchData);
			var resultString = getResultString(result);
			if(!savedSearches[resultString]) {
				savedSearches[resultString] = confirmResults(result)
			} 
			return savedSearches[resultString];
		})
	}
}

function processSearch(stock) {
	var results = {};
	return function(detail) {
		var hash = JSON.stringify(detail);
		if(!results[hash]) {
			var inventory = getAllLines(stock,detail.cat)
			//'this' is bound to inventory when filters are evaluated
			var bySize = filterBySize.bind(this,detail.size);
			var byPrice = filterByPrice.bind(this,[detail.min,detail.max]);
			var byMF = filterBySex.bind(this,detail.sex);
			var result = inventory.filter(bySize).filter(byMF).filter(byPrice);
			results[hash] = result
		}
		return results[hash]
	}
}

function getResultString(result){
	var sizeDetails = findSelected('detailed')[0] + findSelected('requiredSize')[0];
	var hash =  result.map(item=>item.id).join('') + sizeDetails;
	return hash 	
}

function handleSliders(event) {
	var maxPrice = document.getElementById('maxPrice');
	var minPrice = document.getElementById('minPrice');
	var max = changeSlider(maxPrice);
	var min = changeSlider(minPrice);
	document.getElementById('showmix').innerHTML = `£${min} to £${max}`
	if(event) {
		var slider = event.target;
		//max value of min shouldn't be more than value of max
		if(slider.name==='maxPrice') {
			minPrice.max = maxPrice.value-2;
		}
	}
} 

function handleSubmit(event) {
	var searchFields = getSearchFields();
	var searchedEvent = event?event.target.name==='detailed':false;
	if(window.innerHeight<1000&&window.innerWidth>739) {
		window.scrollTo(0,200);
	}
	setSliderValues([searchFields.min,searchFields.max]);		
	searchStock(searchFields,searchedEvent);
}

function changeSlider(item) {
	var target = item.previousElementSibling;
	var value = Number(item.value);
	var max = Number(item.max);
	var width = item.getBoundingClientRect().width;
	var left = item.getBoundingClientRect().left
	var targetValue = (left - 20) +(width/max)*value;
	target.style.left = targetValue+'px';
	target.innerHTML = value;
	return value
}

function searchStock(detail) {
	var filteredStock = productList(detail);
	var searchresults = document.getElementById('searchresults');
	var oldSection 		= searchresults.lastChild;
	filteredStock.then(function(section){			
		if(!oldSection) {
			searchresults.appendChild(section);
		} else {
			searchresults.replaceChild(section,oldSection);
		}
	})
}

function confirmResults(stock) {
	if(stock.length) {
		return displayResults(stock);
	}
	else {
		var searchresults = createDOM('div')
		searchresults.appendChild(document.createTextNode('no results found'));
		searchresults.style.minHeight = '700px';
		return searchresults
	}
}

function getSearchFields() {
	return {
		sex:	findSelected('MF'),
		cat:	findSelected('clothingType'),
		min:	document.getElementById('minPrice').value,
		max:	document.getElementById('maxPrice').value,
		size:	findSelected('requiredSize')
	}
}

function getAllLines(stock,detail) {
	var byCategory = mapByCategory.bind(this,stock);
	return [].concat( ...detail.map(byCategory) )
}


function mapByCategory(stock,category){
	if(stock.hasOwnProperty(category)) {
		return stock[category].inventory;
	}
}

function filterByPrice(minMax,item) {
	return item.price >= minMax[0] && item.price <= minMax[1];
}

function filterBySex(maleFemale,item) {
	return maleFemale.includes(item.sex);
}

function filterBySize(size,item){
	size = parseInt(size[0],10);
	return item.sizes.includes(size);
}

function findSelected(name) {
	return Array.from(document.getElementsByName(name))
	.filter(function(which){
		return which.checked;
	})
	.map(function(item){
		return item.dataset.id;
	});
}

function setSliderValues(minMax) {
	var min 			= document.getElementById('minPriceSelected');
	var max 			= document.getElementById('maxPriceSelected');
	min.innerHTML = minMax[0];
	max.innerHTML = minMax[1];
}

function displayResults(filteredStock) {
	var section 					= createDOM('section');
	var lowestPrice 			= 999;
	var lowestPricedItem 	= null;
	filteredStock.forEach(function(item){
		var product = new Product(item);
		var viewSize = findSelected('detailed')[0];
		var s = findSelected('requiredSize');
		var priceCheck = parseFloat(item.price,10);
		var resultBox 	= createDOM('div');
		resultBox.classList.add('product')
		if(priceCheck<lowestPrice)  {
			lowestPrice = priceCheck;
			lowestPricedItem = resultBox;
		}
		if(viewSize==='400') {
			resultBox.appendChild(product.searchResult(s));
		} else if (viewSize==='100') {
			resultBox.appendChild(product.briefResult());
			resultBox.classList.add('minimal')
		}
		section.appendChild(resultBox)
		window.removeEventListener('scroll',scrollStart,false);
		window.addEventListener('scroll',scrollStart,false);
		window.scrollTo(0,window.scrollY+1)
	
	})
	highlightItem(lowestPricedItem);
	return section
}

function highlightItem(item) {
	var lowestPrice = new Image(140,140);
	lowestPrice.src = './img/lowestPrice.svg';
	lowestPrice.alt = 'lowest priced item';
	lowestPrice.classList.add('lowestPrice')
	item.insertBefore(lowestPrice,item.firstChild);
	item.style.background='#ffd900';
	item.classList.add('lowest');
}

function fixSearchBar() {
	var fixTop = document.getElementById('advancedSearch');
	var targetWidth = (document.getElementById('inputForm').getBoundingClientRect().width-20)+'px';
	if(fixTop.getBoundingClientRect().top<0) {
		if(!fixTop.classList.length) {
			fixTop.classList.add('fixed');
			fixTop.style.width = targetWidth;
		}
	} else if (window.scrollY<259){
		if(fixTop.classList.length===1) {
			fixTop.classList.remove('fixed');
			fixTop.style.width = 'auto';
		}
	}
	var bottomLimit = document.getElementsByTagName('article')[0];	
	var limit = window.innerHeight-bottomLimit.getBoundingClientRect().top;
	var bottomCheck = bottomLimit.getBoundingClientRect().top-4<fixTop.getBoundingClientRect().bottom;
	if(fixTop.classList.length===2) {
		fixTop.style.bottom = limit+'px';
		if(limit<4) {
			fixTop.classList.remove('bottom');
			fixTop.style.bottom = 'auto';
		}
	}
	if(bottomCheck) {
		if(fixTop.classList.length===1) {
			fixTop.classList.add('bottom');
			fixTop.style.bottom = limit+'px';			
		}
	} 
}