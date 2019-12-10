let context = null; // the Web Audio "context" object
let midiAccess = null; // the MIDIAccess object.
let bufferLoader; // buffer
let filter; // biquad filter
let filterDefault = 5000; // default value
let freqMax = 20000; // frequency max

// 0. Resume audio context
document.getElementById('button-resume').addEventListener('click', function() {
    console.log('resume')
    context.resume().then(() => {
        console.log('Audio context resumed');
    });
});

// when document is ready
window.addEventListener('load', function () {
    // 1. Init AudioContext
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext(); // eslint-disable-line no-undef
    bufferLoader = new BufferLoader(
        context,
        [
            '../samples/Crash1.wav',
            '../samples/Crash2.wav',
            '../samples/HHC.wav',
            '../samples/HHO.wav',
            '../samples/Kick.wav',
            '../samples/Ride.wav',
            '../samples/Snare.wav',
            '../samples/Tom1.wav',
            '../samples/Tom2.wav',
            '../samples/Tom3.wav'
        ],
        finishedLoading
    );
    bufferLoader.load();

    // 2. Init Web Midi
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
    } else {
        console.log("No MIDI support present in your browser.    You're gonna have a bad time.");
    }
});

// 3. Midi callback is called if Midi is accessible
function onMIDIInit (midi) {
    console.log('MIDI ready!');

    let haveAtLeastOneDevice = false;
    let inputs = midi.inputs.values();

    // assign Midi Event Handler for all midi Inputs (for example)
    for (let input of inputs) {
        console.log(input); // id : new one is created on machine reboot or on new connection
        input.onmidimessage = midiMessageEventHandler;
        haveAtLeastOneDevice = true;
    }
    if (!haveAtLeastOneDevice) { console.log("No MIDI input devices present. You're gonna have a bad time."); }
}

// Reject Midi
function onMIDIReject (err) {
    console.log(`The MIDI system failed to start.    You're gonna have a bad time. ${err}`);
}

// 4. Event handler which receive all Midi Messages
function midiMessageEventHandler (event) {
    // [Status (message type + channel), Data 1 (note), Data 2 (velocity)]
    let str = 'MIDI message received [' + event.data.length + ' bytes]: ';
    for (let i = 0; i < event.data.length; i++) {
        str += event.data[i] + ' ';
    }
    console.log(str);

    // Mask off the lower nibble (MIDI channel, which we don't care about)
    console.log("event.data[0] & 0xf0", event.data[0] & 0xf0)
    switch (event.data[0] & 240) {
        case 144:
            if (event.data[2] > 0) { // if velocity > 0, this is a note-on message
                noteOn(event.data[1], event.data[2]);
            }
            break;
        // note off if necessary
        // case 128:
        //     noteOff(event.data[1]);
        //     break;
        case 176:
            continuousController(event.data[1], event.data[2]);
            break;
    }
}

function continuousController (ctrlNumber, value) {
    console.log("ctrlNumber", ctrlNumber)
    if (ctrlNumber === 75) {
        filter.frequency.value = ((Math.exp(value / 127) - 1)) * freqMax;
        filterDefault = filter.frequency.value;
    }
}

// 4. play sound when note on
function noteOn (noteNumber, velocity) {
    console.log('note on', noteNumber, velocity);
    if (noteNumber === 50) {
        playSound(bufferLoader.bufferList[0]);
    }
    if (noteNumber === 52) {
        playSound(bufferLoader.bufferList[1]);
    }
    if (noteNumber === 53) {
        playSound(bufferLoader.bufferList[2]);
    }
    if (noteNumber === 55) {
        playSound(bufferLoader.bufferList[3]);
    }
    if (noteNumber === 57) {
        playSound(bufferLoader.bufferList[4]);
    }
    if (noteNumber === 59) {
        playSound(bufferLoader.bufferList[5]);
    }
    if (noteNumber === 60) {
        playSound(bufferLoader.bufferList[6]);
    }
    if (noteNumber === 62) {
        playSound(bufferLoader.bufferList[7]);
    }
    if (noteNumber === 64) {
        playSound(bufferLoader.bufferList[8]);
    }
    if (noteNumber === 65) {
        playSound(bufferLoader.bufferList[9]);
    }
}

function noteOff (noteNumber) {
    console.log('note off', noteNumber);
}

function finishedLoading (bufferList) {
    console.log('Buffer loaded !');
}

// 5. Create Web Audio Graph
function playSound (buffer) {
    // creates a buffer audio source
    let source = context.createBufferSource();
    // tell the source which sound to play
    source.buffer = buffer;
    // 6. Add filter
    // add filter - second time
    // filter = context.createBiquadFilter();
    // filter.frequency.value = filterDefault;
    // source.connect(filter);
    // // connect filter node to the context's destination (the speakers)
    // filter.connect(context.destination);
    source.connect(context.destination)
    // play the source now
    source.start(0);
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