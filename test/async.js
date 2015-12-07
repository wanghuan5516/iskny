/**
 * Created by Administrator on 15-3-21.
 */

var async = require("async");
async.parallel([
    function(callback){
        setTimeout(function(){
            callback(null, 'one');
        }, 200);
    },
    function(callback){
        setTimeout(function(){
            callback(null, 'two');
        }, 100);
    }
],
// optional callback
    function(err, results){
        // the results array will equal ['one','two'] even though
        // the second function had a shorter timeout.
        console.log(results);
    });


// an example using an object instead of an array
async.series({
        one: function(callback){
            setTimeout(function(){
                callback(null, 1);
            }, 200);
        },
        two: function(callback){
            setTimeout(function(){
                callback(null, 2);
            }, 100);
        }
    },
    function(err, results) {
        // results is now equals to: {one: 1, two: 2}
        console.log(results);
    });