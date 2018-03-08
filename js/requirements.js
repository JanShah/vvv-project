//customer enters their details : 
//	name: email address: 
// preferences of clothing type
// gender
//price
//size
//output filtered results to dom

function getProducts() {
	var stock;
	var memoized = {};
	getStock('products',function(){
		stock = this;
	});
	return function (searchData) {
		var searchString = makeString(searchData);
		if(!memoized[searchString]) {
			memoized[searchString] = processSearch(stock,searchData)
		} 
		return memoized[searchString];
	}
}

var productList = getProducts();

window.onload = function () {
	var form = document.getElementById('advancedSearch');
	if(window.innerWidth>739) {
		window.addEventListener('scroll',fixSearchBar,{passive:true});
	}
	var min = document.getElementById('minPriceSelected');
	var max = document.getElementById('maxPriceSelected');
	var lowPrice = document.getElementById('minPrice').value;
	var highPrice = document.getElementById('maxPrice').value;

	min.innerHTML = lowPrice;
	max.innerHTML = highPrice;

	Array.from(document.getElementsByTagName('input')).forEach((item,index)=>{
		//ignore the first 3 input fields (including the one on top of the page)
		if(index>2) {
			item.addEventListener('change',handleSubmit,{passive:true});
			if(item.type==='range') {
				item.addEventListener('input',handleSliders);
			}
		}
		
	});
	window.setTimeout(function() {
		handleSliders()
		handleSubmit();
	},0);
}

function makeString(detail) {
	var searchString = '';
	for(var thing in detail) {
		searchString+=detail[thing].toString();
	}
	return searchString.split(',').join('');
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
		if(slider.name==='minPrice') {
			slider.max = maxPrice.value-2 ;
		} else if(slider.name==='maxPrice') {
			minPrice.max = maxPrice.value-2;
		}
	}

} 


function changeSlider(item) {
	var target = item.nextElementSibling;
	var value = Number(item.value);
	var max = Number(item.max);
	var width = item.getBoundingClientRect().width;
	var targetValue = 15+(width/max)*value;
	target.style.left = targetValue+'px';
	target.innerHTML = value;
	return value
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

function searchStock(detail) {
		var filteredStock = productList(detail);
		confirmResults(filteredStock);
}

function confirmResults(stock) {
	if(stock.length) {
		displayResults(stock);
	}
	else {
		var searchresults = document.getElementById('searchresults');
		searchresults.innerHTML = 'no results found';
		searchresults.style.minHeight = '700px';
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
	return [].concat( ...detail.cat.map(byCategory) )
}


function processSearch(stock=[],detail={}) {
	var inventory 		= getAllLines(stock,detail)
	var byPrice 			= filterByPrice.bind(this,[detail.min,detail.max]);
	var byMaleFemale 	= filterBySex.bind(this,detail.sex);
	var bySize 				= filterBySize.bind(this,detail.size);

	return inventory
		.filter(bySize)
		.filter(byMaleFemale)
		.filter(byPrice);
}

function mapByCategory(stock,category){
	if(stock.hasOwnProperty(category)) {
		return stock[category].inventory;
	}
}

function filterByPrice(minMax,item) {
	var min = minMax[0];
	var max = minMax[1];
	var itemPrice = parseFloat(item.price,10);
	return itemPrice >= min && itemPrice <= max;
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
	var searchresults 		= document.getElementById('searchresults');
	var oldSection 				= searchresults.lastChild;
	var section 					= createDOM('section');
	var lowestPrice 			= 999;
	var lowestPricedItem 	= null;

	if(!oldSection) {
		searchresults.appendChild(section);
	} else {
		searchresults.replaceChild(section,oldSection);
	}

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
		}
		section.appendChild(resultBox)

		window.removeEventListener('scroll',scrollStart,false);
		window.addEventListener('scroll',scrollStart,false);
		
	})
	highlightItem(lowestPricedItem);
	
}

function highlightItem(item) {
	var img = new Image(140,140);
	img.src = './img/lowestPrice.svg';
	img.alt = 'lowest priced item';
	item.insertBefore(img,item.firstChild);
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