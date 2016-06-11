
function processData(input) {
    //Enter your code here
    var oVC = new VideoControl();
    oVC.init();
    
    //Get list of console commands to run
    var arrCommands = input.split("\n");
    
    arrCommands.forEach(function (cmd) {
        console.log("Processing: " + cmd);
        
        var arrMatches = cmd.match(/(\w+)\((["'](\w+)["'])?\)/i);
        if (arrMatches != null) {
            var command = arrMatches[1];
            var video = arrMatches[3];
            
            if (command == "videoViewed")
                oVC.videoViewed(video);
            else if (command == "getRanking")
                console.log("Ranking for '" + video + "': " + oVC.getRanking(video));
            else if (command == "getTopVideos")
                console.log(oVC.getTopVideos());
            else
                console.log("Unable to handle command (" + command + ")");
        } else {
            console.log("Did not understand command: " + cmd);
        }
    });
}

/**
 * Video Model describes a given video.
 *
 * @param strVideoId string Name of the video
 */
var Video = function (strVideoId) {
    this.name = strVideoId;
    this.watchCount = 0;
    this.ranking = -1;
}

/**
 * VideoControl manipualtes the video store, tracking which videos are watched and their ranks.
 */
var VideoControl = function () {
    //**Properties
    var _arrVideoStore;
    var _arrVideoNameIndex;
    
    //**Public methods
    /**
     * Initializes the VideoControl instance
     */
    this.init = function () {
        _arrVideoStore = [];
        _arrVideoNameIndex = {};
    };
    
    /**
     * Updates the view count of a video
     *
     * @params strVideoId string Name of the video
     *
     * @returns void
     */
    this.videoViewed = function (strVideoId) {
        var oVideo = _getOrCreateVideoById(strVideoId);
        
        oVideo.watchCount++;
        
        //Construct sortable array for quick return
        _updateRanking();

    };
    
    /**
     * Gets the ranking of the video. Returns -1 when video has never been watched.
     *
     * @params strVideoId string Name of the video
     *
     * @returns int
     */
    this.getRanking = function (strVideoId) {
        return _getOrCreateVideoById(strVideoId).ranking;
    };
    
    /**
     * Gets a list of the top 10 videos by name.
     *
     * @returns array
     */
    this.getTopVideos = function () {
        var arrReturn = [];
        var intTotal = 10;
        if (_arrVideoStore.length < 10) intTotal = _arrVideoStore.length;
        for (var i = 0; i < intTotal; ++i) {
            arrReturn.push(_arrVideoStore[i].name);
        }
        return arrReturn;
    };
    
    
    /** Private Methods **/
    /**
     * Gets the specified video record.  If the record
     * does not exist, it is created and returned.
     *
     * @params strVideoId string Name of the video to return.
     *
     * @returns Video
     */
    function _getOrCreateVideoById(strVideoId) {
        var oVideo;
        
        if (strVideoId in _arrVideoNameIndex) {
            var index = _arrVideoNameIndex[strVideoId];
            oVideo = _arrVideoStore[index];
        } else {
            oVideo = new Video(strVideoId);
            _arrVideoStore.push(oVideo);
            _arrVideoNameIndex[strVideoId] = _arrVideoStore.length - 1; //update index
        }
        
        return oVideo;
    }
    
    /**
     * Reviews the watch count of all videos and ranks them in the array.
     *
     * @returns void
     */
    function _updateRanking() {
        //Sort videos; most watched should be on top
        _arrVideoStore.sort(function (a, b) {
            return b.watchCount - a.watchCount;
        });
        
        //Update the ranking for easy access and udpate the name index lookup
        for (var i = 0; i < _arrVideoStore.length; ++i) {
            _arrVideoStore[i].ranking = i + 1; //ranking is 1 based
            _arrVideoNameIndex[_arrVideoStore[i].name] = i;
        }
    }


}








process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    if (input.indexOf("end") > -1)
        processData(_input);
    else
        _input += input;
});

process.stdin.on("end", function () {
    processData(_input);
});
