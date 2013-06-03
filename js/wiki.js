define('wiki', [
    'modules/tabs',
    'modules/tracking'
],

    function(tabs, tracking) {

        tracking({
            site: "skytoolkit",
            section: "wiki",
            headline: "",
            contentType: "home",
            contentId: "",
            account: "",
            mpaccount: ""
        });

    }
);
