import { handleActions } from 'redux-actions';

const background = handleActions(
    {
        SET_BACKGROUND: (state, action) => (action.payload.background)
    },
    ''
)

export { background as default }