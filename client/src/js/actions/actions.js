import { createActions } from 'redux-actions';

export const backgroundActions = createActions(
    {
        SET_BACKGROUND: background => ({ background })
    }
)

export const savedThreadsActions = createActions(
    {
        SET_BOOKMARKS: bookmarks => ({ bookmarks }),
        SAVE_THREAD: thread => ({ thread }),
        UNSAVE_THREAD: index => ({ index })
    }
)

export const threadActions = createActions(
    {
        SET_BOARD: board => ({ board }),
        SET_THREAD: thread => ({ thread }),
        SET_POSTS: posts => ({ posts })
    }
)

export const repliesActions = createActions(
    {
        SHOW_REPLIES: (replies, post) => ({ replies, post }),
        UPDATE_REPLIES: (replies, stack) => ({ replies, stack }),
        SHOW_REPLY_SOURCE: (source, position) => ({ source, position })
    },
    'HIDE_REPLIES',
    'HIDE_REPLY_SOURCE'
)

export const imagesActions = createActions(
    {
        SHOW_IMAGES: (images, activeIndex) => ({ images, activeIndex }),
        UPDATE_CACHE: (tim, data) => ({ tim, data })
    },
    'HIDE_IMAGES',
    'CLEAR_CACHE'
)

