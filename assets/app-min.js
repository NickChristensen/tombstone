function findPayment(t,e,a,r){var n,o,i,d,s,l,c;t=parseFloat(t),e=parseFloat(e),a=parseFloat(a),r=parseFloat(r),n=t-e,o=a/100/12,months=12*r,i=1-1/Math.pow(1+o,months),d=n*o;var u={};return u.payment=d/i,u.total=u.payment*months+e,u.interest=u.total-e-n,u.interestRatio=u.interest/u.total,u}function updateFromUrl(){var t=window.location.hash.substr(2).split("-");if(draggables.length===t.length)for(var e=draggables.length-1;e>=0;e--){var a=draggables[e].dataset.decimals?"0,0.00":"0,0",r=parseFloat(t[e]);isNaN(r)||(draggables[e].textContent=numeral(r).format(a))}init()}function init(){for(var t=draggables.length-1;t>=0;t--)new Scrubbing(draggables[t],{driver:[Scrubbing.driver.Mouse,Scrubbing.driver.Touch],adapter:myAdapter});myAdapter.calc()}var draggables=document.querySelectorAll(".draggable"),myAdapter={body:document.querySelector("body").style,init:function(t){this[t.node.id]=t.node.textContent.replace(/,/g,"")},start:function(t){this.formatString=t.node.dataset.decimals?"0,0.00":"0,0";var e=parseFloat(t.node.textContent.replace(/,/g,""));return e=e?e:1,this.body.cursor="ew-resize",t.options.resolver.divider=1e3/e,e},change:function(t,e){e=t.node.dataset.decimals?Math.round(100*e)/100:Math.floor(e),formattedValue=numeral(e).format(this.formatString),t.node.textContent=formattedValue,this[t.node.id]=e,this.calc()},calc:function(){var t=findPayment(this.price,this.down,this.rate,this.duration);document.getElementById("payment").textContent=numeral(t.payment).format("0,0.00"),document.getElementById("total").textContent=numeral(t.total).format("0,0.00")},end:function(t){this.body.cursor="";var e=[this.price,this.down,this.rate,this.duration].join("-");history.replaceState({},"","#/"+e)}};window.addEventListener("hashchange",updateFromUrl);for(var i=draggables.length-1;i>=0;i--)draggables[i].addEventListener("click",function(){this.focus()});updateFromUrl();