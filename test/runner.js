define('runner',[
        'specs/accordionSpec'
        ,'specs/carouselSpec'
        ,'specs/datePickerSpec'
        ,'specs/inPageNavSpec'
        ,'specs/popupSpec'
        ,'specs/shareSpec'
    ], function(){

    mocha.run();

});