
function Candidates(compare_f) {

    this.candidates = [];
    this.compare_f = compare_f
    this.add = function(candidate) {

        if (this.candidates.length == 0) {
            this.candidates.push(candidate);
            return;
        }

        switch (this.compare_f(candidate, this.candidates[0])) {

            case "worse":
                break;

            case "better":
                this.candidates = [];

            case "equal":
                this.candidates.push(candidate);
            }
    };

    this.choose = function() {

        if (this.candidates.length == 0)
            return null;
        
        var i = Math.floor(Math.random() * this.candidates.length);

        return this.candidates[i];
    };
    
    this.total = function() {

        return this.candidates.length;
    };

}
