import create from 'zustand'

interface InformationStore {
  tab: 'transcription' | 'translation'
  translation: string | null
  toLanguage: string
  translating: boolean | null
  setTab: (tab: 'transcription' | 'translation') => void
  setTranslation: (translation: string | null) => void
  setToLanguage: (language: string) => void
  setTranslating: (isTranslating: boolean | null) => void
}

export const useInformationStore = create<InformationStore>((set) => ({
  tab: 'transcription',
  translation: null,
  toLanguage: 'Select language',
  translating: null,
  setTab: (tab) => set({ tab }),
  setTranslation: (translation) => set({ translation }),
  setToLanguage: (language) => set({ toLanguage: language }),
  setTranslating: (isTranslating) => set({ translating: isTranslating }),
}))
