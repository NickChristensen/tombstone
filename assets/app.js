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
	deno = 1 - (1 / Math.pow((1 + monthlyRate), months));
	nume = principal * monthlyRate;

	var result={};
	result.payment = nume/deno;
	result.total = (result.payment * months) + down;
	result.interest = result.total - down - principal;
	result.interestRatio = result.interest/result.total;

	return result;
}

var myAdapter = {
	body: document.querySelector('body').style,
	init : function ( scrubbingElement ) {
		this[scrubbingElement.node.id] = scrubbingElement.node.textContent.replace(/,/g,'');
	},
	start : function ( scrubbingElement ){
		// Determine if we need decimals
		this.formatString = scrubbingElement.node.dataset.decimals ? '0,0.00' : '0,0';
		// strip extra characters
		var initValue = parseFloat ( scrubbingElement.node.textContent.replace(/,/g,'') );
		// don't let it be 0
		initValue = initValue ? initValue : 1;
		// lock the cursor to resize
		this.body.cursor = 'ew-resize';
		// Variable Resistance based on starting number
		scrubbingElement.options.resolver.divider = 1000/initValue;
		return initValue;
	},
	change : function ( scrubbingElement, value ) {
		// Round the value to the correct digits
		if( scrubbingElement.node.dataset.decimals ){
			value = Math.round(value*100)/100;
		}
		else{
			value = Math.floor(value);
		}
		formattedValue = numeral(value).format(this.formatString);
		scrubbingElement.node.textContent = formattedValue;
		this[scrubbingElement.node.id] = value;
		this.calc();
	},
	calc : function(){
		var result = findPayment( this.price, this.down, this.rate, this.duration );
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

// Trigger the calculation
myAdapter.calc();