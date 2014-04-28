if (typeof demo==='undefined') demo={};
demo.skycons = (function() {


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

    sortSkyconsTable();

});

if (typeof window.define === "function" && window.define.amd){
    define([], function() {
        return demo.skycons();
    });
} else {
    demo.skycons = demo.skycons();
}
