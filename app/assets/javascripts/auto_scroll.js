
// When user scrolls, turn off auto scrolling
$(window).scroll(function() {
    if (auto_scroll.is_scrolling++ > 0) {
        auto_scroll.turn_off();
    }
});

var auto_scroll = new function() {

    function get_furthest_div() {
        
        var candidates = new Candidates(function(a, b) {
            if ($(a).offset().top > $(b).offset().top) {
                return "better";
            }
            else {
                return "worse";
            }
        });

        var divs = document.getElementsByClassName("performance_div");
        for (var i=0; i<divs.length; i++) {
            candidates.add(divs[i]);
        }

        return candidates.choose();
    }

    // modified http://stackoverflow.com/a/13559171
    function scrollToBottom(div){

      auto_scroll.is_scrolling = -Infinity;

      div_height = $(div).height();
      div_offset = $(div).offset().top;
      window_height = $(window).height();
      $('html,body').animate({
        scrollTop: div_offset-window_height+div_height
      },'slow').promise().done(function() { auto_scroll.is_scrolling = -1; }); 
    }
    

    function scroll_to_furthest_div() {

        var furthest_div = get_furthest_div();

        scrollToBottom(furthest_div);
    }

    this.is_scrolling = 0;
    this.is_on = false;

    this.turn_on = function() {
        this.is_on = true;
        scroll_to_furthest_div();
    }

    this.turn_off = function() {
        this.is_on = false;
    }

    this.scroll_if_on = function() {
        if (this.is_on) {
            scroll_to_furthest_div();

        }
    }
};


