/*
* Takes price, down payment yearly rate (percent), and duration (years).
* Outputs monthly payment, total paid, ratio of interest, more?
*/
function findPayment( price, down, rate, duration){
	var principal,
			monthlyRate,
			deno,
			nume,
			total,
			payment,
			interest;
	price = parseFloat(price);
	down = parseFloat(down);
	rate = parseFloat(rate);
	duration = parseFloat(duration);
	principal = price - down;
	monthlyRate = (rate / 100) / 12;
	months = duration * 12;
	deno = 1 + monthlyRate;
	deno = Math.pow(deno, months);
	deno = 1 / deno;
	deno = 1 - deno;
	nume = principal * monthlyRate;

	var result={};
	result.payment = nume/deno;
	result.total = (result.payment * months) + down;
	result.interest = result.total - down - principal;

	return result;
}

var myAdapter = {
	body: document.querySelector('body').style,
	init : function ( scrubbingElement ) {},
	start : function ( scrubbingElement ){
		var initValue = parseFloat ( scrubbingElement.node.textContent.replace(/,/g,'') );
		initValue = initValue ? initValue : 1;
		// lock the cursor to resize
		this.body.cursor = 'ew-resize';
		// Variable Resistance based on starting number
		scrubbingElement.options.resolver.divider = 1000/initValue;
		// strip extra characters, pass number to scrubber
		return initValue;
	},
	change : function ( scrubbingElement, value ) {
		if(scrubbingElement){
			var decimals = scrubbingElement.node.dataset.decimals;
			var formatString = decimals ? '0,0.00' : '0,0';
			formattedValue = numeral(value).format(formatString);
			scrubbingElement.node.textContent = formattedValue;
		}
		var result = findPayment( document.getElementById('price').textContent.replace(/,/g,''), document.getElementById('down').textContent.replace(/,/g,''), document.getElementById('rate').textContent.replace(/,/g,''), document.getElementById('duration').textContent.replace(/,/g,'') );
		document.getElementById('payment').textContent = numeral(result.payment).format('0,0.00');
		document.getElementById('total').textContent = numeral(result.total).format('0,0.00');
	},
	end : function ( scrubbingElement ) {
		// Release the cursor style
		this.body.cursor = '';
	}
};

// Init the draggable numbers
var draggables = document.querySelectorAll('.draggable');
for (var i = draggables.length - 1; i >= 0; i--) {
	new Scrubbing ( draggables[i] , {
		driver : [
			Scrubbing.driver.Mouse,
			Scrubbing.driver.Touch
		],
		adapter  : myAdapter,
	});
}

// Trigger the calculation - This should be abstracted out to a separate function
myAdapter.change();
