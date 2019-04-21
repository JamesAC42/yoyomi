import { handleActions } from 'redux-actions';

const savedThreads = handleActions(
    {
        SET_BOOKMARKS: (state, action) => ([
            ...action.payload.bookmarks
        ]),
        SAVE_THREAD: (state, action) => ([
            ...state,
            action.payload.thread
        ]),
        UNSAVE_THREAD: (state, action) => ([
            ...state.slice(0, action.payload.index),
            ...state.slice(action.payload.index + 1)
        ])
    },
    []
)

export { savedThreads as default } 

