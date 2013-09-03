$(document).ready(function(){

// Details / summary polyfill
  if (!('open' in document.createElement('details'))) {
    document.documentElement.className += ' no-details';

    $('details>div').hide(); // hide the children of details
    $('summary').attr('tabindex', '0'); // make summary keyboard selectable 
    $('summary').click(function() {
      var thisContent = $(this).parent().children('div');
      thisContent.toggle(); // show/hide content onclick
    });
    $('summary').keypress(function(e) {
      if(e.which == 13){  // If enter key pressed
      	$(this).click();  // trigger the click, it bubbles up to the parent element
    	}
    });
  } 


// Setup the hidden text & ARIA attributes for all
   $('summary .close').hide();
   $('summary .open').show();
   $('details>div').attr({'aria-expanded': 'false', 'tabindex': '-1'});
   $('summary').attr({'role': 'button', 'aria-pressed': 'false'});

   // Actions to do when a show/hide control is toggled.
   $('summary').click(function() {
      // toggle status text
      $(this).children('span').toggle();

      var thisContent = $(this).parent().find(">div");
      
      // toggle aria values.
      if ($(thisContent).attr('aria-expanded') == 'false') {
         $(thisContent).attr('aria-expanded', 'true');
         $(thisContent).focus();
      } else {
         $(thisContent).attr('aria-expanded', 'false');
      }
      if ($(this).attr('aria-pressed') == 'false') {
         $(this).attr('aria-pressed', 'true');
      } else {
         $(this).attr('aria-pressed', 'false');
      }

    });
  });