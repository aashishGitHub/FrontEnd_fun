(function() {
    var backdrop = document.getElementsByClassName("backdrop");
    var popup = document.getElementsByClassName("overlay");
    var btn = document.getElementById("button-modal");

    document.onclick = function(e) {        
        if(!backdrop[0].hidden) {
            // Show popup
            backdrop[0].hidden = true;
            popup[0].hidden = true;
        }
    };
    
    btn.onclick = function(e) {
        backdrop[0].hidden = false;
        popup[0].hidden = false;
        e.stopPropagation();
    }
    
    

})()
