var PGLowLatencyAudio = {
  
preloadFX: function ( id, assetPath, success, fail) {
if (cordova){
    return cordova.exec(success, fail, "PGLowLatencyAudio", "preloadFX", [id, assetPath]);
	}
},    
    
preloadAudio: function ( id, assetPath, voices, success, fail) {
if (cordova)
    return cordova.exec(success, fail, "PGLowLatencyAudio", "preloadAudio", [id, assetPath, voices]);
},
    
play: function (id, success, fail) {
if (cordova)
    return cordova.exec(success, fail, "PGLowLatencyAudio", "play", [id]);
},
    
stop: function (id, success, fail) {
if (cordova)
    return cordova.exec(success, fail, "PGLowLatencyAudio", "stop", [id]);
},
    
loop: function (id, success, fail) {
if (cordova)
    return cordova.exec(success, fail, "PGLowLatencyAudio", "loop", [id]);
},
    
unload: function (id, success, fail) {
if (cordova)
    return cordova.exec(success, fail, "PGLowLatencyAudio", "unload", [id]);
}
    
    
};