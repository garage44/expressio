import {Button} from '@garage44/common/components'
import {classes} from '@garage44/common/lib/utils'
import {setTouched} from '@garage44/common/lib/validation'

export function FieldText({
    autofocus = false,
    className = '',
    copyable = false,
    disabled = false,
    label = '',
    help = '',
    model,
    onBlur = null,
    onClick = null,
    onKeyDown = null,
    placeholder = '...',
    transform = null,
    type = 'text',
    validation = null,
}) {
    return <div class={classes('c-field-text', 'field', className, {
        'is-invalid': validation?.isValid === false,
        'is-touched': validation?.isTouched,
    })}>
        {!!label &&
        <div class="label">
            {label} {validation && <span class="indicator">*</span>}
        </div>}
        <div class="field-wrapper">
            <input
                autofocus={autofocus}
                disabled={disabled}
                onClick={(e) => {
                    if (onClick) onClick(e)
                }}
                onBlur={(e) => {
                    if (model) {
                        setTouched(model, true)
                    }

                    if (onBlur) onBlur(e)
                }}
                onKeyDown={(e) => {
                    if (onKeyDown) onKeyDown(e)
                }}
                onInput={(e) => {
                    let value = (e.target as HTMLInputElement).value
                    if (transform) {
                        value = transform(value)
                    }
                    model.value = value
                }}
                autocomplete={type === 'password' ? 'new-password' : 'on'}
                placeholder={placeholder}
                type={type}
                value={model}
            />
            {type === 'password' && copyable && <Button
                icon="content_copy"
                onClick={() => {
                    navigator.clipboard.writeText(model.value)
                }}
                type="info"
            />}
        </div>
        {(() => {
            if (validation && validation.errors.length > 0 && validation.isTouched) {
                return validation?.errors.map((error, i) => (
                    <div key={i} class="validation">{error}</div>
                ))
            }
            if (help) {
                return <div class="help">{help}</div>
            }
        })()}
    </div>
}
