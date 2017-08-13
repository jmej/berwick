
var timers = {};


function changeVol(zoneId) {
	var slider = $('#volume');
	var value = slider.val();
	//console.log("Changing volume for " + zoneId + " to " + value);
	$('#volume').text(value);
	if(timers[zoneId]){
		clearTimeout(timers[zoneId]);
	}
	timers[0] = setTimeout(function(){
		console.log("sent " + value + " to vol" );
		$.ajax({
			url: '/vol/',
			method: 'POST',
			dataType: 'text',
			contentType: 'text/plain',
			data: value
		}).done(function(d){ console.log("RESPONSE: " + d);});
	}, 50);
}

function mute(){
	var button = $('#mute');
	var state = button.text().trim() == 'muted';
	$.ajax({
		url: '/mute/',
		method: 'POST',
		dataType: 'text',
		contentType: 'text/plain',
		data = state
	}).done(fundtion(d){console.log("RESPONSE: " + d)});
}

onload = function(){
	$('#mute').click(function(){
	    console.log($(this).text());
	    if($(this).text().trim() == 'audible (click to mute)' ){
	        $(this).text('muted');
	    }else{
	         $(this).text('audible (click to mute)');
	    }
	});
};

