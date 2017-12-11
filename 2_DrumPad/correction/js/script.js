let context = null // the Web Audio "context" object
let midiAccess = null // the MIDIAccess object.
let bufferLoader // buffer
let filter // biquad filter
let filterDefault = 5000 // default value
let freqMax = 20000 // frequency max

// when document is ready
window.addEventListener('load', function () {
  // Init Web Audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  context = new AudioContext() // eslint-disable-line no-undef
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
  )
  bufferLoader.load()

  // Init Web Midi
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject)
  } else {
    console.log("No MIDI support present in your browser.  You're gonna have a bad time.")
  }
})

function listInputsAndOutputs (inputs, outputs) {
  if (inputs) {
    for (let input of inputs.values()) {
      console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
        "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
        "' version:'" + input.version + "'")
    }
  }
  if (outputs) {
    for (let output of outputs.values()) {
      console.log("Output port [type:'" + output.type + "'] id:'" + output.id +
        "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
        "' version:'" + output.version + "'")
    }
  }
}

// Init Midi
function onMIDIInit (midi) {
  console.log('MIDI ready!')

  midiAccess = midi

  // log all inputs / ouputs
  listInputsAndOutputs(midi.inputs, midi.ouputs)
  let haveAtLeastOneDevice = false
  let inputs = midiAccess.inputs.values()

  // assign Midi Event Handler for all midi Inputs (for example)
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = MIDIMessageEventHandler
    haveAtLeastOneDevice = true
  }
  if (!haveAtLeastOneDevice) { console.log("No MIDI input devices present.  You're gonna have a bad time.") }
}

// Reject Midi
function onMIDIReject (err) {
  console.log(`The MIDI system failed to start.  You're gonna have a bad time. ${err}`)
}

// Handler which receive all Midi Messages
function MIDIMessageEventHandler (event) {
  // print message in hexadecimal : [Status, Data 1, Data 2]
  var str = 'MIDI message received [' + event.data.length + ' bytes]: '
  for (var i = 0; i < event.data.length; i++) {
    str += '0x' + event.data[i].toString(16) + ' '
  }
  console.log(str)

  // event.data = [Note on / off, note, velocity]
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2] !== 0) { // if velocity != 0, this is a note-on message
        noteOn(event.data[1], event.data[2])
      }
      break
      // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      noteOff(event.data[1])
      break
    case 0xB0:
      continuousController(event.data[1], event.data[2])
      break
  }
}

function continuousController (ctrlNumber, value) {
  if (ctrlNumber === 75) {
    filter.frequency.value = ((Math.exp(value / 127) - 1) / (Math.exp(1) - 1)) * freqMax
    filterDefault = filter.frequency.value
    console.log("filterDefault", filterDefault, value)
  }
}

function noteOn (noteNumber, velocity) {
  console.log('note on', noteNumber, velocity)
  if (noteNumber === 50) {
    playSound(bufferLoader.bufferList[0])
  }
  if (noteNumber === 52) {
    playSound(bufferLoader.bufferList[1])
  }
  if (noteNumber === 53) {
    playSound(bufferLoader.bufferList[2])
  }
  if (noteNumber === 55) {
    playSound(bufferLoader.bufferList[3])
  }
  if (noteNumber === 57) {
    playSound(bufferLoader.bufferList[4])
  }
  if (noteNumber === 59) {
    playSound(bufferLoader.bufferList[5])
  }
  if (noteNumber === 60) {
    playSound(bufferLoader.bufferList[6])
  }
  if (noteNumber === 62) {
    playSound(bufferLoader.bufferList[7])
  }
  if (noteNumber === 64) {
    playSound(bufferLoader.bufferList[8])
  }
  if (noteNumber === 65) {
    playSound(bufferLoader.bufferList[9])
  }
}

function noteOff (noteNumber) {
  console.log('note off', noteNumber)
}

function finishedLoading (bufferList) {
  console.log('Buffer loaded !')
}

function playSound (buffer) {
  // creates a sound source
  let source = context.createBufferSource()
  // tell the source which sound to play
  source.buffer = buffer
  // add filter
  filter = context.createBiquadFilter()
  filter.frequency.value = filterDefault
  source.connect(filter)
  // connect filter node to the context's destination (the speakers)
  filter.connect(context.destination)
  // play the source now
  source.start(0)
}

function BufferLoader (context, urlList, callback) {
  this.context = context
  this.urlList = urlList
  this.onload = callback
  this.bufferList = []
  this.loadCount = 0
}

BufferLoader.prototype.loadBuffer = function (url, index) {
  // Load buffer asynchronously
  let request = new XMLHttpRequest() // eslint-disable-line no-undef
  request.open('GET', url, true)
  request.responseType = 'arraybuffer'
  let loader = this

  request.onload = function () {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function (buffer) {
        if (!buffer) {
          console.log('error decoding file data: ' + url)
          return
        }
        loader.bufferList[index] = buffer
        if (++loader.loadCount === loader.urlList.length) { loader.onload(loader.bufferList) }
      },
      function (error) {
        console.error('decodeAudioData error', error)
      }
    )
  }

  request.onerror = function () {
    console.log('BufferLoader: XHR error')
  }

  request.send()
}

BufferLoader.prototype.load = function () {
  for (let i = 0; i < this.urlList.length; ++i) { this.loadBuffer(this.urlList[i], i) }
}
