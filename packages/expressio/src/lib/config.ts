import {$s} from '@/app'
import {api} from '@garage44/common/app'
import {mergeDeep} from '@garage44/common/lib/utils'

export async function loadConfig() {
    const config = await api.get('/api/config')

    mergeDeep($s, {
        enola: config.enola,
        language_ui: {selection: config.language_ui},
        logger: config.logger,
        workspaces: config.workspaces,
    }, {usage: {loading: false}})
}
