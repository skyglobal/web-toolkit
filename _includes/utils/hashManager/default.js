function myHashCallback() {
    $('#currentHash').text(location.hash);
}

toolkit.hashManager.register(['hash', 'anotherHash', 'wildcard/*'], myHashCallback);