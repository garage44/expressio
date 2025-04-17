import {$s, api, logger, store} from '@/app'
import {copyObject, keyMod, keyPath} from './utils.ts'
import {effect} from '@preact/signals'
import i18next from 'i18next'

export function i18nFormat(i18n, targetLanguages) {
    const _i18n = copyObject(i18n)
    const i18nextFormatted = {}
    for (const language of targetLanguages) {
        i18nextFormatted[language.id] = {translation: {}}
    }

    keyMod(_i18n, (_srcRef, _id, refPath) => {
        const _i18nObject = keyPath(_i18n, refPath)

        if (typeof _i18nObject === 'object') {
            if ('target' in _i18nObject) {
                for (const [language_id] of Object.entries(_i18nObject.target)) {
                    if (!i18nextFormatted[language_id]) {
                        i18nextFormatted[language_id] = {translation: {}}
                    }
                    const _18nextObject = keyPath(i18nextFormatted[language_id].translation, refPath.slice(0, -1), true)
                    _18nextObject[refPath[refPath.length - 1]] = _i18nObject.target[language_id]
                }
            }
        }
    })

    return i18nextFormatted
}

export async function init(translations = null) {
    let resources

    if (!translations) {
        resources = await api.get('/api/translations')
        logger.info(`loading languages from endpoint: ${Object.keys(resources).join(', ')}`)
    } else {
        resources = translations
        logger.info(`loading languages from bundle: ${Object.keys(resources).join(', ')}`)
    }

    for (const language_id of Object.keys(resources)) {
        $s.language_ui.i18n[language_id] = {}
    }

    i18next.init({
        debug: process.env.NODE_ENV !== 'production',
        fallbackLng: 'eng-gbr',
        interpolation: {
            escapeValue: false,
        },
        lng: $s.language_ui.selection,
        resources,
    })

    effect(() => {
        const language = $s.language_ui.selection
        i18next.changeLanguage(language)
        logger.info(`Language changed to: ${language}`)
        store.save()
    })
}

/**
 * A simple reactive signal based translation function, which
 * allows to switch languages without having to reload the page.
 * @param key Translation key
 * @param context Translation context
 */
export const $t = (key: string, context = null): string => {
    if (!$s.language_ui.i18n[$s.language_ui.selection]) {
        $s.language_ui.i18n[$s.language_ui.selection] = {}
    }

    // Create a cache key that includes both the key and context
    const cacheKey = context ? `${key}:${JSON.stringify(context)}` : key

    if (!$s.language_ui.i18n[$s.language_ui.selection][cacheKey]) {
        $s.language_ui.i18n[$s.language_ui.selection][cacheKey] = i18next.t(key, context)
    }
    return $s.language_ui.i18n[$s.language_ui.selection][cacheKey]
}
