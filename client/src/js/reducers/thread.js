import { handleActions } from 'redux-actions';

const thread = handleActions(
    {
        SET_BOARD: (state, action) => ({
            ...state,
            board: action.payload.board
        }),
        SET_THREAD: (state, action) => ({
            ...state,
            thread: action.payload.thread
        }),
        SET_POSTS: (state, action) => ({
            ...state,
            posts: action.payload.posts
        })
    },
    {
        board: undefined,
        thread: undefined,
        posts: []
    }
)

export { thread as default }