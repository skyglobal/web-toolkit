var demo = (function(logger) {
    function bindEvents() {
        $(document).on('click','.toggler', toggle);
        $('.sky-form').on('submit', checkDiff);
    }

    function checkDiff(e) {
        e.preventDefault();
        var oldVersion = $('#version').val(),
            newVersion = $('.wiki-header small').text().replace('v',''),
            route = 'http://web-toolkit.global.sky.com';
        if (oldVersion.split('.').length<3 || (oldVersion.split('.')[0]<1)){
            $('.sky-form .error').text("The version number is required, and must be '1.0.0' or higher");
        }
        if (parseFloat(oldVersion,10)===1 || (oldVersion.split('.')[0]==='0')){
            oldVersion = '0.6.9';//get lowest version available
        }
        window.toolkit.diff({
            oldRoute: route + '/' + oldVersion + '/_site/_includes/',
            newRoute: route + '/' + newVersion + '/_site/_includes/'
        });
    }

    function sortSkyconsTable(){
        var skycons = [];
        var rows = $('#wiki-skycons tbody tr');
        rows.each(function(i){
            skycons.push({i:i, skycon:$(this).find('td').first().text().trim()});
        });
        skycons.sort(function (a, b) {
            if (a.skycon > b.skycon) {
                return 1;
            } else if (a.skycon < b.skycon) {
                return -1;
            } else {
                return 0;
            }
        });
        $('#wiki-skycons tbody tr').remove();
        for (var i=0; i<skycons.length; i++){
            $('#wiki-skycons tbody').append($(rows[skycons[i].i]));
        }
    }

    function toggle(){
        var $toggler = $(this);
        var $example = $('div[data-toggle=' + $toggler.attr('for') + ']');
        if ($example.hasClass('open')){
            $toggler.removeClass('open');
            $example.removeClass('open');
        } else {
            $toggler.addClass('open');
            $example.addClass('open');
        }
    }

    logger();
    bindEvents();
    sortSkyconsTable();
});

if (typeof window.define === "function" && window.define.amd){
    define('demo', ['utils/developer-notes-logger'], function(developerNotesLogger) {
            return demo(developerNotesLogger);
 });
} else {
    demo(developerNotesLogger);
}
