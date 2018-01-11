function start() {
	return function entries(num) {
		return function operator(op) {
			console.log('op is: ',op,op=='=')
			return op=='='?finalBit:sumit

			function finalBit() {
				console.log('got here')
				return
			}		
			function sumit(entry) {
				console.log(entry+num)
				return entries(entry + num)
			}
		}
	}
}

var cal = start() 

let first = cal(33)('+')(55)('+')(44)('=')
//let second = cal(33)('+')(45)
//console.log('first result',first,second)