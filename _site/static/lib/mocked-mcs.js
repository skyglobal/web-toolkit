var params = {};
window.location.search.substring(1).split('&').forEach(function(pair) {
    console.debug('Param:', pair);
    pair = pair.split('=');
    params[pair[0]] = pair[1];
});

params.callback({
    name: {
        first: 'Ben',
        surname: 'Fletcher'
    }
});
