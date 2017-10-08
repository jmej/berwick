
var timers = {};
var muteState = {};
var currentlyPlaying = {};
var override = 0;

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

function toggle_live(){
  if (override == "1"){
      override = "0";
      $('#override').text("click to disable mics / listen to archives");
    }else{
      override = "1";
      $('#override').text("Click to re-enable live mics");
  }

  console.log("sending override "+ override);
  $.ajax({
      url: '/override',
      method: 'POST',
      dataType: 'text',
      contentType: 'text/plain',
      data: override
  }).done(function(d){console.log("RESPONSE: " + d)});
}

function mute(button){

    if ((button == "0") && (muteState.muted)){
      mutingBehavior = "1";
    }else{
      mutingBehavior = button;
    }

    console.log("sending mutestate "+ mutingBehavior);
    $.ajax({
        url: '/mute',
        method: 'POST',
        dataType: 'text',
        contentType: 'text/plain',
        data: mutingBehavior
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

    //initialize slider with value from last pd osc message recieved - just once to avoid weird feedback
    $.ajax({
        type: 'GET',
        dataType: 'json', 
        url: '/vol',
        success: function(data){
          //console.log(data);
          slider.noUiSlider.set(data);
        },

         "error":function(error){
         //handle error here
        }
      })

    slider.noUiSlider.on('slide', function(){
        var value = slider.noUiSlider.get();
        console.log("value is "+value);
        changeVol(value);
    });

    $('#override').click(function(){
        toggle_live();
    });

    $('#mute').click(function(){
        mute("0");
    });

    $('#mute-1-hr').click(function(){
        mute("60");
    });

    $('#mute-4-hr').click(function(){
        mute("240");
    });

    $('#mute-8-hr').click(function(){
        mute("480");
    });

    setInterval(function(){

      $.ajax({
        type: 'GET',
        dataType: 'json', 
        url: '/mute-state',
        success: function(data){
          //console.log(data);
          muteState = data;
          if (muteState.muted){
            $('#mute').text('click to un-mute');
            $("#mute-state").html("System is currently muted");
            $("#mute-timer").html("un-muting in "+muteState.hours+":"+muteState.mins+":"+muteState.secs);
          }else{
            $('#mute').text('click to mute');
            $("#mute-state").html("System is currently un-muted");
            $("#mute-timer").html("");
          }
          //special case for infinite mute from pd
          if ((muteState.hours == '999')&&(muteState.mins == '999')&&(muteState.secs == '999')){
            $("#mute-timer").html("");
          }
        },

         "error":function(error){
         //handle error here
        }
      })

      $.ajax({
        type: 'GET',
        dataType: 'json', 
        url: '/currently_playing',
        success: function(data){
          //console.log(data);
          currentlyPlaying = data;
          if (currentlyPlaying.liveInput){
            $('#currently_playing').text('live audio');
          }else{
            $('#currently_playing').text('Recording '+currentlyPlaying.file);
          }
        },

         "error":function(error){
         //handle error here
        }
      })

    }, 1000);

};

