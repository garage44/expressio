import {h} from 'preact'

interface StateViewProps {
    state?: any
    title?: string
}

const renderValue = (value: any): string => {
    if (value === null) {
        return 'null'
    }
    if (value === undefined) {
        return 'undefined'
    }
    if (typeof value === 'string') {
        return `"${value}"`
    }
    if (typeof value === 'boolean') {
        return value.toString()
    }
    if (typeof value === 'number') {
        return value.toString()
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return '[]'
        }
        return `[${value.length} items]`
    }
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value, null, 2)
        } catch {
            return '[Object]'
        }
    }
    return String(value)
}

export const StateView = ({state, title = "Component State"}: StateViewProps) => {
    if (!state) {
        return null
    }

    const renderStateEntry = (key: string, value: any) => (
        <div class="c-state-view__entry" key={key}>
            <span class="c-state-view__key">{key}:</span>
            <span class="c-state-view__value">{renderValue(value)}</span>
        </div>
    )

    return (
        <div class="c-state-view">
            <div class="c-state-view__header">
                <h4 class="c-state-view__title">{title}</h4>
            </div>
            <div class="c-state-view__content">
                {typeof state === 'object' && state !== null ? (
                    Object.entries(state).map(([key, value]) => renderStateEntry(key, value))
                ) : (
                    <div class="c-state-view__entry">
                        <span class="c-state-view__value">{renderValue(state)}</span>
                    </div>
                )}
            </div>
        </div>
    )
}