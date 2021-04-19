function updateSlider() {
	manuallyUpdateSlider($(this));
}
function manuallyUpdateSlider(slider) {
	let val = slider.val();
	let suffix = slider.siblings('.range-value').data('suffix');
	slider.siblings('.range-value').text(format(val) + suffix);
}
function format(val) {
	return Number(val).toLocaleString('sv-SE', { useGrouping: true});
}
function formatSEK(val) {
	return Number(val).toLocaleString('sv-SE', {
		minimumFractionDigits: 0, 
		maximumFractionDigits: 0, 
		style: 'currency', 
		currency: 'SEK', 
		useGrouping: true
	});
}
function formatPercentage(val) {
	return Math.round(val*100)/100 + ' %';
}

function getStandardInput() {
	let input = {
		'MONTHLY': true,
		'WEEKLY': false,
		'lon_annan_anstallning': 0,
		'timarvode': 750,
		'antal_timmar': 1750,
		'onskad_lon_brutto_manad': 45000,
		
		'veckoarvode': false,
		'antal_veckor': false,
		'onskad_lon_brutto_vecka': false,

		'kostnader': 5000,
		'pension': false,
		'bil': false,
		'rnd': false,
	};
	return input;
}

// COLORS
let light_green = 'rgb(211,222,160)';
let green = 'rgb(171,182,120)';
let light_blue = 'rgb(156,198,209)';
let blue = 'rgb(78,133,147)';
let dark_blue = 'rgb(52,94,109)';
let sand = 'rgb(250,238,205)';
let gray = 'rgb(208, 206, 206)';
let light_red = 'rgb(255, 134, 124)';
let red = 'rgb(235, 94, 84)';
let dark_red = 'rgb(195, 54, 44)';