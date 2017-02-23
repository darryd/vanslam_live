


auto_scroll = new function() {

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

    // http://stackoverflow.com/a/13559171
    function scrollToBottom(div){
      div_height = $(div).height();
      div_offset = $(div).offset().top;
      window_height = $(window).height();
      $('html,body').animate({
        scrollTop: div_offset-window_height+div_height
      },/*'slow'*/ 1000);
    }
    

    this.scroll_to_furthest_div = function() {

        var furthest_div = get_furthest_div();

        scrollToBottom(furthest_div);
    }
};


