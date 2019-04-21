import {
    createStore,
    combineReducers
} from 'redux';

import background from './reducers/background';
import savedThreads from './reducers/savedThreads';
import thread from './reducers/thread';
import replies from './reducers/replies';
import images from './reducers/images';

let initState = {
    background: '',
    savedThreads: [],
    thread: {
        board: undefined,
        thread: undefined,
        posts: []
    },
    replies: {
        repliesVisible:false,
        replies:[],
        replyStack: [],
    },
    images: {
        imageViewerVisible: false,
        imageIndexInit: 0,
        imageCache: {},
        activeImages: []
    }
}

const yomiReducer = combineReducers({
    background,
    savedThreads,
    thread,
    replies,
    images
});

const configureStore = (reducer, intstate) => {
    return createStore(reducer, initState);
}

export default configureStore(yomiReducer, initState);