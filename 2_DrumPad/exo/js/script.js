let context = null; // the Web Audio "context" object
let midiAccess = null; // the MIDIAccess object.
let bufferLoader; // buffer
let filter; // biquad filter
let filterDefault = 5000; // default value
let freqMax = 20000; // frequency max

// 0. Resume audio context


// when document is ready
window.addEventListener('load', function () {
    // 1. Init AudioContext
    // ...

    // 2. Init Web Midi
    // ...
});

// 3. Midi callback is called if Midi is accessible
function onMIDIInit (midi) {
    console.log('MIDI ready!');
    // ...
}

// Reject Midi
function onMIDIReject (err) {
    console.log(`The MIDI system failed to start.    You're gonna have a bad time. ${err}`);
}

// 4. Event handler which receive all Midi Messages
function midiMessageEventHandler (event) {
    // ...
}

// 6. Add filter
function continuousController (ctrlNumber, value) {
    // ...
}

// 4. play sound when note on
function noteOn (noteNumber, velocity) {
    // ...
}

function noteOff (noteNumber) {
    console.log('note off', noteNumber);
}

function finishedLoading (bufferList) {
    console.log('Buffer loaded !');
}

// 5. Create Web Audio Graph
function playSound (buffer) {
    // ...
}

class BufferLoader {
    context;
    urlList;
    onload;
    bufferList = [];
    loadCount = 0;
  
    constructor(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
    }
  
    loadBuffer(url, index) {
        // Load buffer asynchronously
        let loader = this; // set loader
        let request = new XMLHttpRequest(); // create asynchronous request
        request.open('GET', url, true); // init request
        request.responseType = 'arraybuffer'; // type of response: arraybuffer
  
        // success transaction = 200 from server
        request.onload = function () {
            // Asynchronously decode the audio file data contained in ArrayBuffer in request.response
            // baseAudioContext.decodeAudioData(ArrayBuffer, successCallback, errorCallback);
            loader.context.decodeAudioData(
                request.response,
                function (buffer) {
                    if (!buffer) {
                        console.log('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount === loader.urlList.length) { loader.onload(loader.bufferList); }
                },
                function (error) {
                    console.error('decodeAudioData error', error);
                }
            );
        };
  
        request.onerror = function () {
            console.log('BufferLoader: XHR error');
        };

        // send request to server
        request.send();
    };
  
    load() {
        for (let i = 0; i < this.urlList.length; ++i) { this.loadBuffer(this.urlList[i], i); }
    };
  
}