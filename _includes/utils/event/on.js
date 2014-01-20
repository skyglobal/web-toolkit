var elOn = document.getElementById('css-demo-event-on');

toolkit.event.on(elOn,'click',updateEventOn);

function updateEventOn(){
    $(elOn).text('now i\'m on.');
}