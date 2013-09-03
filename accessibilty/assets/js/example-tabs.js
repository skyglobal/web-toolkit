var ariaTabs = (function() {
  $(function() {
    //for each tabs DIV...
    $(".ariatabs").each( 
      function(t){
        var thisTabs = $(this);

        //for each individual tab DIV, set class and aria role attributes, and hide it
        $(thisTabs).find(">div").attr({"class": "tabPanel", "role": "tabpanel", "aria-hidden": "true"}).hide();

        //get the list of tab links
        var listOfTabs = $(this).find(">ul").attr({"role": "tablist", "class": "listOfTabs"}); 

        //for each item in the listOfTabs...
        $(listOfTabs).find("li>a").each(
          function(a){
            //create a unique id using the tab link's href
            var tabId="tab-"+$(this).attr("href").slice(1);
            //assign tabId, aria and tabindex attributes to the tab control, and remove the href so that JAWS 10 and NVDA in IE don't read it
            $(this).attr({"id": tabId, "role": "tab", "aria-selected": "false"}).parent().attr("role", "presentation");
            //assign aria attribute to the relevant tab panel
            $(thisTabs).find(".tabPanel").eq(a).attr("aria-labelledby", tabId);
            //set the click event for each tab link
            $(this).click(
              function(e){
                //prevent default click event
                e.preventDefault();
                //change state of previously selected tabList item
                $(listOfTabs).find(">li.current").removeClass("current").find(">a").attr({"aria-selected": "false"});
                //hide previously selected tabPanel
                $(thisTabs).find(".tabPanel:visible").attr("aria-hidden", "true").hide();
                //show newly selected tabPanel
                $(thisTabs).find(".tabPanel").eq($(this).parent().index()).attr("aria-hidden", "false").show();
                //set state of newly selected tab list item
                $(this).attr({"aria-selected": "true"}).parent().addClass("current");
                // Set the focus to the current tab 
                $(this).focus();
              }
            );
          }
        );
        
        //set keydown events on tabList item for navigating tabs
        $(listOfTabs).delegate("a", "keydown",
          function (e) {
            switch (e.which) {
              case 37: case 38:
                if ($(this).parent().prev().length!=0) {
                  $(this).parent().prev().find(">a").click();
                } else {
                  $(listOfTabs).find("li:last>a").click();
                }
                break;
              case 39: case 40:
                if ($(this).parent().next().length!=0) {
                  $(this).parent().next().find(">a").click();
                } else {
                  $(listOfTabs).find("li:first>a").click();
                }
                break;
              case 13:
                $(this).click();
                break;  
            }
          }
        );
        //show the first tabPanel
        $(thisTabs).find(".tabPanel:first").attr("aria-hidden", "false").show();
        //set state for the first listOfTabs li
        $(listOfTabs).find("li:first").addClass("current").find(">a").attr({"aria-selected": "true"});
      }
    );
  });
})();