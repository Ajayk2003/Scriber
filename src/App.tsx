import { useRef, useEffect } from 'react'
import HomePage from './components/pages/HomePage'
import Header from './components/Header'
import Information from './components/pages/Information'
import Transcribing from './components/pages/Transcribing'
import useScribeStore from './store/Audio.store'
import FileDisplay from './components/pages/FileDisplay'
import { MessageTypes } from './utils/presets'
import Footer from './components/Footer'

function App() {
  const { file, audioStream, output, setOutput, setDownloading, loading, setLoading, setFinished } =
    useScribeStore() // Replace {} with the actual values from your store

  const isAudioAvailable = file || audioStream

  const worker = useRef<Worker | null>(null)

  // UseEffect to catch the message from the worker
  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), {
        type: 'module',
      })
    }

    const onMessageReceived = async (e: MessageEvent) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true)
          console.log('DOWNLOADING')
          break
        case 'LOADING':
          setLoading(true)
          console.log('LOADING')
          break
        case 'RESULT':
          setOutput(e.data.results)
          console.log(e.data.results)
          break
        case 'INFERENCE_DONE':
          setFinished(true)
          console.log('DONE')
          break
      }
    }
    //Event listener to receive msgs from the worker
    worker.current.addEventListener('message', onMessageReceived)
    //cleanup function to remove the event listener
    return () => worker.current?.removeEventListener('message', onMessageReceived)
  })

  async function readAudioFrom(file: File | Blob) {
    const sampling_rate = 16000
    const audioCTX = new AudioContext({ sampleRate: sampling_rate })
    const response = await file.arrayBuffer()
    const decoded = await audioCTX.decodeAudioData(response)
    const audio = decoded.getChannelData(0)
    return audio
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) {
      return
    }
    let audio
    if (file) {
      audio = await readAudioFrom(file)
    }
    const model_name = 'openai/whisper-tiny.en'

    worker.current?.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name,
    })
  }

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />
        {output ? (
          <Information />
        ) : loading ? (
          <Transcribing />
        ) : isAudioAvailable ? (
          <FileDisplay handleFormSubmission={handleFormSubmission} />
        ) : (
          <HomePage />
        )}
      </section>
      <Footer />
    </div>
  )
}

export default App
