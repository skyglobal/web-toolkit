// Loops through a page looking for Youtube links and uses the Accessible Media Player 
// https://github.com/nomensa/Accessible-Media-Player
function playVideos() {
    var $yt_links = $("a[href*='http://www.youtube.com/watch']"); 

    $.each($yt_links, function(i) { 
        var $holder = $('<div class="player" />'); 
        var $caption_link = $(this).siblings('.captions'); 
        var captions_file = ($caption_link.length > 0) ? $caption_link.attr('href') : null;
        var link = $(this).attr('href').split("=")[1]; 
        if ($holder.player) {
            $(this).parent().replaceWith($holder); 
            $holder.player({ 
                id : 'yt_player_' + i,
                media : link,
                captions : captions_file
            });
        }
        else {
            $caption_link.remove()
        }
    });
}


// set the size variable for later use amongst functions 
var size = 0;

// Work out the width of the page
function getSize() {

    size = window.getComputedStyle(document.body,':after').getPropertyValue('content');
    if (size) {
        size = size.replace(/["']/g, "");
        size = parseInt(size, 10);
    } else {
        size = 0;
    }
    return size;
}


$(document).ready(function(){

    // Trigger video function
    playVideos();

    // Load table of contents on content pages
    $('#toc').toc({
        'selectors': 'h2', //elements to use as headings
        'container': 'main' //element to find all selectors in
    });

    // Fix the skip link issue in Webkit
    $("#skiplink").click(function() {
        $('main').focus();
    });
    $("#toplink").click(function() {
        $('#top').focus();
    });


    // If the window is under 768, remove the positioning applied by the later function.
    $(window).resize(function() {
        if (getSize() < 768) {
            $('nav.secondary-nav').css({'position': 'static'});
        }
    });

    // fix the secondary naviation to the side

    $(window).scroll(function(e){
        $el = $('nav.secondary-nav');

        // If the window height is more than the navigation height:
        if (window.innerHeight > $el.height()) {
            // set position fixed
            if ($(this).scrollTop() > 165 && $el.css('position') != 'fixed'){
                // check there is enough width.
                if (getSize() >= 768 ) {
                    $el.css({'position': 'fixed', 'top': '0px'});
                }
            }
            // set as absolute, once back above the point.
            if ($(this).scrollTop() < 165 && $el.css('position') != 'absolute'){
                if (getSize() >= 768 ) {
                    $el.css({'position': 'absolute', 'top': '165px'});
                }
            }
        } else {
            var totalHeight = 165 + $el.height();
            var topPosition = window.innerHeight - $el.height();
            var scrollPoint = totalHeight - window.innerHeight;

            if ($(this).scrollTop() > scrollPoint && $el.css('position') != 'fixed'){
                if (getSize() >= 768 ) {
                    $el.css({'position': 'fixed', 'top': topPosition+'px'});
                }
            }
            if ($(this).scrollTop() < scrollPoint && $el.css('position') != 'absolute'){
                if (getSize() >= 768 ) {
                    $el.css({'position': 'absolute', 'top': '165px'});
                }
            }
        }
    });


});