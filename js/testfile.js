function start() {
	return function entries(num) {
//		console.log('num is: ',num)
		return function operator(op) {
//			console.log('op is: ',op,op=='=')
			return op=='='?finalBit():sumit

			function finalBit() {
//				console.log('got here',num)
				return num
			}		
			function sumit(entry) {
//				console.log('next number in sum: ',entry)
				return entries(entry + num)
			}
		}
	}
}


//var cal = start() 

//let first = cal(33)('+')(55)('+')(44)('=')

//console.log(first)

function calculator() {
	return function (first){
		return function (operator){
			if(operator==='=') {
				return (function() {
					return first
				})()
			} else if(operator==='+') {
				return function(second) {
					return calculator()(first+second)
				}
			} else if(operator==='-') {
				return function(second) {
					return calculator()(first-second)
				}
			}else if(operator==='/') {
				return function(second) {
					return calculator()(first/second)
				}
			}else if(operator==='*') {
				return function(second) {
					return calculator()(first*second)
				}
			}
		}		
	}
}
//let cal2 = calculator()
//const calculate = cal2(33)('-')(25)('/')(25)('+')('53')('*')('53')('=')

//console.log(calculate)



function whichSum(operator,first,second) {
	first = parseInt(first,10)
	second = parseInt(second,10)
	switch (operator) {
		case '+': return first+second
		case '-': return first-second
		case '*': return first*second
		case '/': return first/second
		default: return
	}
}





const cc=()=>f=>o=>
	o==='='?(()=>f)()
	:o==='+'?(s)=>cc()(f+s)
	:o==='-'?(s)=>cc()(f-s)
	:o==='/'?(s)=>cc()(f/s)
	:o==='*'?(s)=>cc()(f*s)
	:(()=>f)()


const cc2=()=>f=>o=>o==='='?(()=>f)():(s,fs={'+':f+s,'-':f-s,'/':f/s,'*':f*s})=>cc2()(fs[o])


let ccc = cc2()(30)('+')(30)('+')(30)('=')

console.log(ccc)


//console.log(calculate)

