var elOn = document.getElementById('css-demo-event-on');

window.updateEventOn = function(){
    elOn.innerHTML = 'now i\'m on.';
};

toolkit.event.on(elOn,'click',window.updateEventOn);
