let Chart = function(config) {

	// TODO
	// X Handle 0 values
	// Remove last invisible line(?) and always a line in middle top
	// X Non static position (200, 200)
	// X Adjustable width of donut
	// Fix linebreak when non square canvas
	// Change that highlight solution
	// X Tooltips or similar
	// Clear values / reset
	// Remove value


	let highlight = undefined;
	let animationFrame;
	let canvas = config.canvas;
	let SPEED = config.speed ? config.speed : 4;
	let THICKNESS = config.thickness ? 
					config.thickness : 
					Math.min(canvas.width, canvas.height) * 0.15;
	let RADIUS = config.radius;
	let GROWTH = config.growth ? config.growth : THICKNESS / 3;

	if (!canvas) {
		console.error('No canvas object specified');
	}
	let ctx = canvas.getContext('2d');

	// tooltip
	const tooltipObject = document.createElement('div');
	// TODO remove some of these CSS properties
	tooltipObject.style.background = '#333';
	tooltipObject.style.color = '#fff';
	tooltipObject.style.display = 'inline-block';
	tooltipObject.style.position = 'fixed';
	tooltipObject.style.pointerEvents = 'none';
	tooltipObject.style.display = 'none';
	tooltipObject.style.padding = '5px';
	tooltipObject.style.borderRadius = '3px';
	document.body.appendChild(tooltipObject);


	function radius() {
		if (RADIUS) {
			return RADIUS;
		}
		return Math.min(canvas.width, canvas.height)/2 - THICKNESS/2 - GROWTH/2 - 20; // padding to register mouse events
	}
	function radians(d) {
		return d * Math.PI / 180;
	}
	function deg(r) {
		return r * (180 / Math.PI);
	}
	function rotateDeg(ctx, d) {
		ctx.translate(canvas.width/2, canvas.height/2);
		ctx.rotate(radians(d));
		ctx.translate(-canvas.width/2, -canvas.height/2);
	}
	function drawArc(ctx, color, d, w) {
		//console.log('d: ' + d);
		ctx.lineWidth = w;
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/2, radius(), 0, radians(d));
		ctx.strokeStyle = color;
		ctx.stroke();
		rotateDeg(ctx, d);
	}
	function lineBreak(ctx, d) {
		ctx.beginPath();
		ctx.moveTo(canvas.width/2, canvas.height/2);
		ctx.lineTo(	canvas.width/2+canvas.width/2*Math.cos(radians(d-90)),
					canvas.height/2+canvas.height/2*Math.sin(radians(d-90)));
		ctx.stroke();
	}
	function draw(highlight) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.globalCompositeOperation='source-over';
		rotateDeg(ctx, -90);
		for (let i = 0; i < data.length; i++ ) {
			drawArc(ctx, data[i].color, data[i].value, i === highlight ? THICKNESS+GROWTH : THICKNESS);
		}
		ctx.restore();
		ctx.globalCompositeOperation='destination-out';
		ctx.lineWidth = 4;
		let traveled = 0;
		for (let i = 0; i < data.length; i++ ) {
			lineBreak(ctx, data[i].value + traveled);
			traveled += data[i].value;
		}
	}
	function compare(val1, val2, direction) {
		if ( direction === -1) {
			return val1 > val2;
		}
		return val1 < val2;
	}
	function reached() {
		for (let i = 0; i < data.length; i++) {
			if (compare(data[i].value, data[i].new_value, data[i].direction)) {
				return false;
			}
		}
		return true;
	}
	function animate() {
		// decide speeds
		let max = 0;
		for ( let i = 0; i < data.length; i++) {
			let diff = Math.abs(data[i].value - data[i].new_value);
			if ( diff > max) max = diff;
		}
		for ( let i = 0; i < data.length; i++) {
			let diff = Math.abs(data[i].value - data[i].new_value);
			data[i].speed = diff / max;
		}
		// decide direction
		for ( let i = 0; i < data.length; i++) {
			if ( data[i].value < data[i].new_value) data[i].direction = 1;
			else data[i].direction = -1;
		}
		window.requestAnimationFrame(step);
	}
	function step() {
		
		for (let j = 0; j < SPEED; j++) {
			for (let i = 0; i < data.length; i++) {
				if (compare(data[i].value, data[i].new_value, data[i].direction)) {
					data[i].value += data[i].speed * data[i].direction;
				}
			}
		}
		if (reached()) {
			for( let i = 0; i < data.length; i++) {
				data[i].value = Math.max(Math.floor(data[i].value), 0);
				draw();
			}
			console.log('stop animation');
			return;
		}
		draw();
		window.requestAnimationFrame(step);
	}

	// Handle input data
	let data = [];
	for (let i = 0; i < config.data.length; i++) {
		data[i] = { 
			color: config.data[i].color, 
			value: 0,
			new_value: config.data[i].value * 3.6,
			id: config.data[i].id,
			tooltip: config.data[i].tooltip,
		}
	}
	animate(); // START

	this.updateValues = function(new_values) {
		for ( let i = 0; i < new_values.length; i++ ) {
			for( let j = 0; j < data.length; j++) {
				if (data[j].id === new_values[i].id) {
					for (const [key, value] of Object.entries(new_values[i])) {
  						if (key === 'new_value') {
							data[j][key] = value * 3.6;
  						} else {
							data[j][key] = value;
  						}
					}
				}
			}
		}
		animate();
	};

	canvas.addEventListener('mousemove', e => {
		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left;
		var y = e.clientY - rect.top;
		var a = x - canvas.width/2;
		var b = y - canvas.height/2;
		var c = Math.sqrt( a*a + b*b );
		if (c > (radius()-THICKNESS/2) && c < (radius()+THICKNESS/2)) {
			canvas.style.cursor = 'pointer';
			var angle = deg(Math.atan2(y-canvas.height/2, x-canvas.width/2) + (5 * Math.PI / 2)) % 360;
			let distance = 0;
			for(let i = 0; i < data.length; i++) {
				if (angle > distance && angle < data[i].value + distance) {
					draw(i);
					highlight = i;
					tooltip.show(data[i].tooltip, e);
					break;
				}
				distance += data[i].value;
			}
		} else {
			canvas.style.cursor = 'default';
			if (highlight !== undefined) draw();
			highlight = undefined;
			tooltip.hide();
		}
	});

	let tooltip = {
		show: function(val, mouseEvent) {
			if(val) {
				tooltipObject.style.top = (mouseEvent.clientY - 10) +'px';
				tooltipObject.style.left = (mouseEvent.clientX + 15) +'px';
				tooltipObject.innerHTML = val;
				tooltipObject.style.display = 'inline-block';
			} else {
				tooltip.hide();
			}
		},
		hide: function() {
			tooltipObject.style.display = 'none';
		}
	};
}