import { create } from 'zustand'

type output = {
  text: string
}

interface AudioStore {
  file: File | null
  audioStream: Blob | null
  output: output[] | null
  downloading: boolean
  loading: boolean
  finished: boolean

  setFile: (file: File | null) => void
  setAudioStream: (audioStream: Blob | null) => void
  setOutput: (output: []) => void
  setDownloading: (downloading: boolean) => void
  setLoading: (loading: boolean) => void
  setFinished: (finished: boolean) => void

  // Add handleAudioReset function
  handleAudioReset: () => void
}

const useAudioStore = create<AudioStore>((set) => ({
  file: null,
  audioStream: null,
  output: null,
  downloading: false,
  loading: false,
  finished: false,

  setFile: (file) => set({ file }),
  setAudioStream: (audioStream) => set({ audioStream }),
  setOutput: (output) => set({ output }),
  setDownloading: (downloading) => set({ downloading }),
  setLoading: (loading) => set({ loading }),
  setFinished: (finished) => set({ finished }),

  // Implement handleAudioReset function
  handleAudioReset: () => {
    set({ file: null, audioStream: null })
  },
}))

export default useAudioStore
