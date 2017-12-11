let context = null // the Web Audio "context" object
let midiAccess = null // the MIDIAccess object.
let bufferLoader // buffer
let filter // biquad filter
let filterDefault // default value
let freqMax = 18000 // frequency max

// when document is ready
window.addEventListener('load', function () {
  // Init Web Audio
  // fill it !

  // Init Web Midi
  // fill it !
})

function listInputsAndOutputs (inputs, outputs) {
  if (inputs) {
    for (let input of inputs.values()) {
      console.log(`Fill it !`)
    }
  }
  if (outputs) {
    for (let output of outputs.values()) {
      console.log(`Fill it !`)      
    }
  }
}

// Init Midi
function onMIDIInit (midi) {
  console.log('MIDI ready!')

  // fill it !
}

// Reject Midi
function onMIDIReject (err) {
  console.log(`The MIDI system failed to start.  You're gonna have a bad time. ${err}`)
}

// Handler which receive all Midi Messages
function MIDIMessageEventHandler (event) {
  // fill it !
}

function continuousController (ctrlNumber, value) {
  // fill it !
}

function noteOn (noteNumber, velocity) {
  // fill it !
}

function noteOff (noteNumber) {
  // fill it !
}

function finishedLoading (bufferList) {
  console.log('Buffer loaded !')
}

function playSound (buffer) {
  // fill it !
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
