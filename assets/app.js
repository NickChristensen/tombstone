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
	body: document.querySelector('body'),
  init : function ( scrubbingElement ) {},
  start : function ( scrubbingElement ){
  	this.body.style.cursor = 'ew-resize';
    return parseInt ( scrubbingElement.node.textContent.replace(',',''), 10 );
  },
  change : function ( scrubbingElement, value ) {
  	if(scrubbingElement){
	  	value = numeral(value).format('0,0');
	    scrubbingElement.node.textContent = value;
	  }
    var result = findPayment( document.getElementById('price').textContent.replace(',',''), document.getElementById('down').textContent.replace(',',''), document.getElementById('rate').textContent.replace(',',''), document.getElementById('duration').textContent.replace(',','') );
    document.getElementById('payment').textContent = numeral(result.payment).format('0,0.00');
    document.getElementById('total').textContent = numeral(result.total).format('0,0.00');
  },
  end : function ( scrubbingElement ) {
  	this.body.style.cursor = '';
  }
};

var draggables = document.querySelectorAll('.draggable');
for (var i = draggables.length - 1; i >= 0; i--) {
	new Scrubbing ( draggables[i] , {
		driver : [
			Scrubbing.driver.Mouse,
			Scrubbing.driver.Touch,
			Scrubbing.driver.MouseWheel
		],
		adapter  : myAdapter,
		resolver : Scrubbing.resolver.HorizontalProvider()
	});
}

myAdapter.change();