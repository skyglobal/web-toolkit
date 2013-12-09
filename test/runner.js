define('runner',[
        'specs/accordionSpec'
        ,'specs/carouselSpec'
    ], function(accordion, carousel){

    mocha.run();

});