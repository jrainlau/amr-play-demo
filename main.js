import AMR from "./amr.js"

function fetchBlob(url) {
  return fetch(url).then((res) => res.blob())
}

function readBlob(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result)
      resolve(data)
    }
    reader.readAsArrayBuffer(blob)
  })
}

function playAmrArray(array) {
  const samples = AMR.decode(array)
  if (!samples) {
    alert("Failed to decode!")
    return
  }
  playPcm(samples)
}

let gAudioContext = new AudioContext()

function getAudioContext() {
  if (!gAudioContext) {
    gAudioContext = new AudioContext()
  }
  return gAudioContext
}
function playPcm(samples) {
  const ctx = getAudioContext()
  const src = ctx.createBufferSource()
  const buffer = ctx.createBuffer(1, samples.length, 8000)
  if (buffer.copyToChannel) {
    buffer.copyToChannel(samples, 0, 0)
  } else {
    const channelBuffer = buffer.getChannelData(0)
    channelBuffer.set(samples)
  }

  src.buffer = buffer
  src.connect(ctx.destination)
  src.start()
}

async function playAmrBlob(blob) {
  const data = await readBlob(blob)
  playAmrArray(data)
}

async function playAmrUrl(url) {
  const blob = await fetchBlob(url)
  playAmrBlob(blob)
}

export { playAmrBlob, playAmrUrl }
