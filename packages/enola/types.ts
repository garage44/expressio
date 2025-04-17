export interface EnolaConfig {
    engines: Record<string, EnolaEngineConfig>
    languages: {
        source: {
            id: string
            name: string
        }[]
        target: {
            formality: boolean
            id: string
            name: string
        }[]
    }
}

export interface EnolaEngine {
    config: EnolaEngineConfig
    logger: EnolaLogger
    init: (config: {api_key: string, base_url: string}, logger: EnolaLogger) => Promise<void>
    translate: (tag: EnolaTag, targetLanguage: TargetLanguage) => Promise<string>
    translateBatch: (batch: EnolaTag[], targetLanguage: TargetLanguage) => Promise<string[]>
    usage: () => Promise<{count: number, limit: number}>
}

export interface EnolaEngineConfig {
    /** Whether the engine is active; e.g. whether the API key is set. */
    active: boolean
    api_key: string
    /** Engines can have a configurable API endpoint; no need to set this for Anthropic, but needed to switch between DeepL and DeepL Pro. */
    base_url?: string
    name: string
    usage: {
        count: number
        limit: number
    }
}

export interface EnolaLogger {
    debug(message: string): void
    error(message: string): void
    info(message: string): void
    warn(message: string): void
}

export interface EnolaTag {
    source: string
    cache?: string
    target: Record<string, string>
}

export interface TargetLanguage {
    engine: 'anthropic' | 'deepl'
    id: string
    name: string
    formality: 'default' | 'more' | 'less'
}

export type TranscriptionSystem =
  | 'ala_lc'    // Arabic, Persian, etc
  | 'din'       // Arabic DIN 31635
  | 'pinyin'    // Chinese
  | 'wade_giles' // Chinese
  | 'hepburn'   // Japanese
  | 'kunrei'    // Japanese
  | 'revised'   // Korean
  | 'mcr'       // Korean (McCune-Reischauer)
  | 'scientific' // Russian/Cyrillic
  | 'iast'      // Sanskrit/Hindi
  | 'dmg'       // Persian
  | null;

export interface Language {
  engines: string[]
  formality?: string[]
  id: string
  name: string
  transcription?: TranscriptionSystem[]
}
