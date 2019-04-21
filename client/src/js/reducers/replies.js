import { handleActions } from 'redux-actions';

const replies = handleActions(
    {
        SHOW_REPLIES: (state, action) => ({
            repliesVisible:true,
            replies: action.payload.replies,
            replyStack: [action.payload.post]
        }),
        HIDE_REPLIES: (state) => ({
            repliesVisible:false,
            replies:[],
            replyStack:[]
        }),
        UPDATE_REPLIES: (state, action) => ({
            ...state,
            replies: action.payload.replies,
            replyStack: action.payload.stack
        })
    },
    {
        repliesVisible:false,
        replies:[],
        replyStack: [],
    }
)

export { replies as default }