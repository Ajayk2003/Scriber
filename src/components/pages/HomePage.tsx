import React, { useState, useEffect, useRef } from 'react'
import useAudioStore from '../../store/Audio.store'

const HomePage: React.FC = () => {
  const { setAudioStream, setFile } = useAudioStore()

  const [recordingStatus, setRecordingStatus] = useState<'inactive' | 'recording'>('inactive')
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [duration, setDuration] = useState<number>(0)

  const mediaRecorder = useRef<MediaRecorder | null>(null)

  const mimeType = 'audio/webm'

  async function startRecording() {
    let tempStream: MediaStream

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })
      tempStream = streamData
    } catch (err) {
      console.log(err.message)
      return
    }

    setRecordingStatus('recording')

    // Create new Media recorder instance using the stream
    const media = new MediaRecorder(tempStream, { mimeType })
    mediaRecorder.current = media

    mediaRecorder.current.start()
    const localAudioChunks: Blob[] = []
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') {
        return
      }
      if (event.data.size === 0) {
        return
      }
      localAudioChunks.push(event.data)
    }

    setAudioChunks(localAudioChunks)
  }

  async function stopRecording() {
    setRecordingStatus('inactive')

    mediaRecorder.current?.stop()
    if (mediaRecorder.current !== null) {
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType })
        setAudioStream(audioBlob)
        setAudioChunks([])
        setDuration(0)
      }
    }
  }

  useEffect(() => {
    if (recordingStatus === 'inactive') {
      return
    }

    const interval = setInterval(() => {
      setDuration((curr) => curr + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [recordingStatus])

  return (
    <main className="flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
        Scr<span className="text-blue-400 bold">iber</span>
      </h1>
      <h3 className="font-medium md:text-lg">
        Record <span className="text-blue-400">&rarr;</span> Transcribe{' '}
        <span className="text-blue-400">&rarr;</span> Translate
      </h3>
      <button
        onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
        className="flex specialBtn px-4 py-2 rounded-xl items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4"
      >
        <p className="text-blue-400">
          {recordingStatus === 'inactive' ? 'Record' : `Stop recording`}
        </p>
        <div className="flex items-center gap-2">
          <i
            className={
              'fa-solid duration-200 fa-microphone ' +
              (recordingStatus === 'recording' ? ' text-rose-300' : '')
            }
          ></i>
          {duration > 0 ? duration + 's' : ''}
        </div>
      </button>
      <p className="text-base">
        Or{' '}
        <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-200">
          upload{' '}
          <input
            onChange={(e) => {
              const tempFile = e.target.files?.[0]
              tempFile && setFile(tempFile)
            }}
            className="hidden"
            type="file"
            accept=".mp3,.wave"
          />
        </label>{' '}
        a mp3 file
      </p>
      <p className="italic text-slate-400">Free now free forever</p>
    </main>
  )
}

export default HomePage
