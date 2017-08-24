
var timers = {};


function changeVol(value) {
	console.log("sending " + value + " to vol" );
	$.ajax({
		url: '/vol',
		method: 'POST',
		dataType: 'text',
		contentType: 'text/plain',
		data: value
	}).done(function(d){ console.log("RESPONSE: " + d);});
}

function mute(button){
	var button = $(button);
	var state = button.text().trim() == 'click to un-mute';
    if (state){
        state = "1";
    }else{
    	if (button.text().trim() == 'click to mute'){
        	state = "0";
    	}
    	if (button.text().trim() == 'click to mute for 1 hour'){
        	state = "60";
    	}
    	if (button.text().trim() == 'click to mute for 4 hours'){
        	state = "240";
    	}
    	if (button.text().trim() == 'click to mute for 8 hours'){
        	state = "480";
    	}
    }
    console.log("sending mutestate "+ state);
	$.ajax({
		url: '/mute',
		method: 'POST',
		dataType: 'text',
		contentType: 'text/plain',
		data: state
	}).done(function(d){console.log("RESPONSE: " + d)});
}

onload = function(){
	var slider = document.getElementById('slider');
	// slider.style.height = '400px';
	// slider.style.margin = '0 auto 30px';
	noUiSlider.create(slider, {
		start: [50],
		connect: true,
		range: {
			'min': 0,
			'max': 100
		},
		pips: { // Show a scale with the slider
			mode: 'positions',
			values: [0,50,100],
			density: 1
		}
	});

	slider.noUiSlider.on('slide', function(){
		var value = slider.noUiSlider.get();
		console.log("value is "+value);
		changeVol(value);
	});

	$('#mute').click(function(){
	    mute('#mute');
	    if($(this).text().trim() == 'click to mute' ){
	        $(this).text('click to un-mute');
	    }else{
	         $(this).text('click to mute');
	    }
	});

	$('#mute-1-hr').click(function(){
	    mute('#mute-1-hr');
	    if($(this).text().trim() == 'click to mute for 1 hour' ){
	        $(this).text('click to un-mute');
	    }else{
	         $(this).text('click to mute for 1 hour');
	    }
	});

	$('#mute-4-hr').click(function(){
	    mute('#mute-4-hr');
	    if($(this).text().trim() == 'click to mute for 4 hours' ){
	        $(this).text('click to un-mute');
	    }else{
	         $(this).text('click to mute for 4 hours');
	    }
	});

	$('#mute-8-hr').click(function(){
	    mute('#mute-8-hr');
	    if($(this).text().trim() == 'click to mute for 8 hours' ){
	        $(this).text('click to un-mute');
	    }else{
	         $(this).text('click to mute for 8 hours');
	    }
	});
};

