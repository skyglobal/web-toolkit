function updateDetectCSS(toolkit){
    var demoTransition = document.getElementById('css-demo-transition');
    var demo3D = document.getElementById('css-demo-support3D');
    var demoTransform = document.getElementById('css-demo-transform');
    var returnTransform = document.getElementById('css-demo-return-transform');

    var transition = toolkit.detect.css('transition');
    var support3D = toolkit.detect.css('support3D');
    var transform = toolkit.detect.css('transform');

    demoTransition.innerHTML = transition;
    demo3D.innerHTML = support3D;
    demoTransform.innerHTML = transform;

    returnTransform.innerHTML = toolkit.detect.css(demoTransition, 'transition');
}

updateDetectCSS(toolkit);