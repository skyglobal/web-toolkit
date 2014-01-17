var elEmit = document.getElementById('css-demo-event-emit');
var elEmitCustom = document.getElementById('css-demo-event-emit-custom');

function updateEventEmit(){
    $(elEmit).text('now my throat is sore');
    toolkit.event.emit(elEmitCustom,'demoCustomEmit');
}

function updateEventEmitCustom(){
    $(elEmitCustom).text(' ....shhh.');
}

toolkit.event.on(elEmit,'click',updateEventEmit);
toolkit.event.on(elEmitCustom,'demoCustomEmit',updateEventEmitCustom);