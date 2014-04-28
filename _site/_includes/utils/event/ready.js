function updateEventReady(){
    document.getElementById('css-demo-event-ready').innerHTML = 'Woah, document loaded.';
}

toolkit.event.ready(updateEventReady);