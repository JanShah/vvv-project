
// Browser compatibility testing and function testing

//console.log(navigator)
//console.log(navigator.appName==="Microsoft Internet Explorer") //'checking for "Microsoft Internet Explorer"'
//console.log(navigator.appVersion.split('; '))
//console.log(navigator.userAgent.split('; '))

function scrollWindow(toItem) {
	var scrollDestination = toItem.getBoundingClientRect().top - 20
	var currentPoint = window.scrollY
	var movePixels = scrollDestination - currentPoint
	for(let x = 0; x<movePixels;x++){
		(function(){
			setTimeout(function(){
				window.scrollTo(0,window.scrollY+1)	
			},1*x)
		})();	
	}
}


function swiper(target,event) {
	// console.log(event,arguments)
	event.preventDefault()
	window.addEventListener('touchcancel',touchCancelled)
	window.addEventListener('touchend',endedSwipe)
	var startingPoint = event.changedTouches[0]
	console.log('entered Touch: ', startingPoint.screenX,startingPoint.screenY)
	window.addEventListener('touchmove',movingTouch)
	var movement,direction

	function movingTouch(event) {
		var movingPoint = event.touches[0]
		movement = movingPoint.screenX  - startingPoint.screenX
		if(movement>10) {
			direction = -1
			event.target.style.left = movement+'px'
		} else if (movement<-10) {
			direction = 1
			event.target.style.left = movement+'px'			
		}
	}

	function touchCancelled(event) {
		window.removeEventListener('touchcancel',touchCancelled)
		window.removeEventListener('touchend',endedSwipe)
		window.removeEventListener('touchmove',movingTouch)
		event.target.style.left=0
		// alert('touch canned')
	}
	function endedSwipe(event) {
		// https://www.abeautifulsite.net/working-with-html5-data-attributes
		var image = event.target
			if(Math.abs(movement)>100) {
				// alert(movement)
				var imageRef = parseInt(image.dataset.ref,10)
				image.style.transition='none'
				if(movement<0) {
					image.style.left = window.innerWidth+'px'
				} else {
					image.style.left = -window.innerWidth+'px'
				}
				if(imageRef+direction===-1) {
					imageRef = target.length-1
					 console.log('replacement image',imageRef)
					 newRef = imageRef
				} else if(imageRef+direction===target.length) {
					console.log('target length',target.length)
					imageRef = 0
					 console.log('replacement image',imageRef)
				 } else {
					 imageRef = imageRef+direction
					console.log('replacement image',imageRef+direction)
				}

				// console.log(imageRef,image.dataset.ref)
				for(var x = 0;x<target.length-1;x++) {
					var xRef = parseInt(target[x].dataset.ref,10)
					//  console.log(xRef,imageRef)
					if(xRef===imageRef) {
						console.log(target[x])
						swapImages(target[x],image)
					}
				}
		}
		setTimeout(function(){
			image.style.transition=''
			image.style.left = '0px'
		},150)
		window.removeEventListener('touchcancel',touchCancelled)
		window.removeEventListener('touchmove',movingTouch)
		window.removeEventListener('touchend',endedSwipe)
		// event.target.style.left = '0px'
	}
}

function seeSwipe() {
	console.log('touch event added to window')
	window.addEventListener('touchstart',swiper)
}
// seeSwipe()
 function show(text) {
	var testOutput = document.getElementById('tests')
	var p = document.createElement('p')
	var span = document.createElement('span')
	span.style.color = 'red'		
	if(text.result) {
		span.style.color = 'green'		
	}
	span.innerHTML = text.result
	p.innerHTML = 'Can it '+text.test+' : '
	p.appendChild(span)
	testOutput.appendChild(p)
}

function isIe() {
var ie = false;
var test = 'be an old ie browser'
	//split the userAgent string into usable chunks and get the second element.
	//tested working in firefox, chrome, ie (document modes) to version 5 
	var re = navigator.userAgent.split('; ')[1];
	var ve = ["MSIE 7.0","MSIE 8.0","MSIE 9.0","MSIE 10.0","WOW64"];
	//console.log(re)
	for(var i = 0; i < ve.length; i++) {
		if(ve[i]===re) {
			ie = true
		}	
	}
	show({test:test,result:ie})
	return ie
}

function canLoadScript() {
	var test = 'load a script to the document'
	var result = false
	try{
		var file = document.createElement('script');
		file.src = './js/testfile.js';
		document.body.appendChild(file);
		result = true
	} catch(e) {
		result = false
	}
	show({test:test,result:result})
}


function isPromiseValid() {
	var test = 'make a Promise'	
	var ie;
	try {
		var p = new Promise(function(resolve,reject){
			resolve(true);
		});
		pr = true;
	} 
	catch(e) {
		pr = false;		
	}
	show({test:test,result:pr})
	return pr;
}

function testJSON() {
	var result = false
	var test = 'stringify and parse JSON'
	var xhr = new XMLHttpRequest()
	xhr.open('GET','../data/products.json')
	xhr.responseType='json'
	xhr.timeout=500
	xhr.send()
	var output

	xhr.onload = function() {
		result = true
		show({test:'deal with XMLHTTPRequest', result: result})
		output = xhr.response
		var stringify = false,parse = false
	try{
		stringJSON = JSON.stringify(output)
		stringify = 'stringify: true'
	} 
	catch(e) {
		stringify = 'stringify: false'
		
	}
	try{
		var parseJSON = JSON.parse(JSON.stringify(output))
		parse = ' parse: true'

	} 
	catch(e) {
		parse = ' parse: false'
	}

	show({test:test, result: stringify+parse})
}

}


console.log(isIe(),isPromiseValid(),testJSON());
canLoadScript()	
