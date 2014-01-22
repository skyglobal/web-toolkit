require(['toolkit'], function(){
    $('#demo-video.video-container').video({
        token:"8D5B12D4-E1E6-48E8-AF24-F7B13050EE85", //this token should be unique to your team
        displayAdverts:false ,
        onPlay: function() { //optional
            //stuff to do before video plays
        },
        closeCallback: function() { //optional
            //stuff to do after video closes
        }
    });
});