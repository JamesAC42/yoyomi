import { handleActions } from 'redux-actions';

const images = handleActions(
    {
        SHOW_IMAGES: (state, action) => ({
            ...state,
            imageViewerVisible: true,
            imageIndexInit: action.payload.activeIndex,
            activeImages: action.payload.images
        }),
        HIDE_IMAGES: (state) => ({
            ...state,
            imageViewerVisible: false,
            imageIndexInit: 0,
            activeImages: []
        }),
        CLEAR_CACHE: (state) => ({
            ...state,
            imageCache: {}
        }),
        UPDATE_CACHE: (state, action) => ({
            ...state,
            imageCache: {
                ...state.imageCache,
                [action.payload.tim]: action.payload.data
            }
        })
    },
    {
        imageViewerVisible: false,
        imageIndexInit: 0,
        imageCache: {},
        activeImages: []
    }
)

export { images as default }