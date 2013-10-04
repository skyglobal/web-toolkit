define(function() {

    function open(args) {
        var url = args.url;
        var width = args.width || 400;
        var height = args.height || width;
        var top = args.top || (screen.height/2)-(height/2);
        var left = args.left || (screen.width/2)-(width/2);
        var windowTitle = args.title || 'Sky';
        return window.open(url, windowTitle, 'top=' + top + ',left=' + left + ',width=' + width + ',height='+ height);
    }

    function init() {
        $('body').on('click', '[data-popup]', function(e) {
            e.preventDefault();
            var args = $.extend($(this).data('popup'), {url: $(this).attr('href')});
            open(args);
        });
    }

    return {
        init: init,
        open: open
    };
});