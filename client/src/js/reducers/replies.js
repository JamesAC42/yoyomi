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
        }),
        SHOW_REPLY_SOURCE: (state, action) => ({
            ...state,
            replySourceVisible: true,
            replySource: action.payload.source,
            replySourcePosition: action.payload.position
        }),
        HIDE_REPLY_SOURCE: (state) => ({
            ...state,
            replySourceVisible: false,
            replySource: null,
            replySourcePosition: {}
        })
    },
    {
        repliesVisible:false,
        replies:[],
        replyStack: [],
        replySourceVisible: false,
        replySource: null,
        replySourcePosition: {}
    }
)

export { replies as default }