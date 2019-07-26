import React, { Component } from 'react';
import { connect } from 'react-redux';

import { 
    imagesActions
} from '../actions/actions.js';

import '../../css/ImageViewer.css';
import '../../css/Loading.css'

import chevronLeft from '../../images/icons/chevron-left-96.png';
import chevronRight from '../../images/icons/chevron-right-96.png';

const mapStateToProps = (state, props) => ({
    thread: state.thread,
    images: state.images
})

const mapDispatchToProps = {
    updateCache: imagesActions.updateCache,
    hideImages: imagesActions.hideImages
}

class NavButtons extends Component {
    render(){
        return(
            <div className="nav-buttons-outer">
                <div className="nav-buttons-inner">
                    {
                        (this.props.currentImage > 0) && 
                        <div 
                            className="image-nav nav-back"
                            onClick={() => this.props.back()}>
                            <div className="image-nav-inner">
                                <img src={chevronLeft} alt="back"/>
                            </div>
                        </div>
                    }
                    {
                        (this.props.currentImage !== (this.props.activeImages.length - 1)) &&
                        <div 
                            className="image-nav nav-forward"
                            onClick={() => this.props.forward()}>
                            <div className="image-nav-inner">
                                <img src={chevronRight} alt="forward"/>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

class ImageContainer extends Component {
    render(){
        if(this.props.loading){
            return(
                <div className="loading">
                    <div className="loading-inner">
                        <div className="loading-ball"></div>
                        <div className="loading-ball"></div>
                        <div className="loading-ball"></div>
                        <div className="loading-ball"></div>
                    </div>
                </div>
            )
        } else {
            if(this.props.error){
                return(
                    <div className="image-error">
                    Image failed to load.
                    </div>
                )
            }
            const image = this.props.image;
            if(image.ext === ".webm"){
                return(
                    <video id="video-viewer" key={this.props.videoUrl} controls loop autoPlay muted> <source src={this.props.videoUrl} type="video/webm"/></video>
                )
            } else {
                const filename = image.filename + image.ext;
                const url = "https://i.4cdn.org/" + this.props.board + "/" + image.tim + image.ext;
                return(
                    <div className="image-container">
                        <div className="image-container-inner">
                            <a 
                                className="image-filename" 
                                title={filename}
                                href={"/yoyomi/" + this.props.board + "/thread/" + this.props.thread + "#p" + image.no}>
                                {filename}
                            </a>
                            <a href={url} rel="noopener noreferrer" target="_blank">
                                <img src={this.props.src} alt="view" />
                            </a>
                        </div>
                    </div>
                )
            }
        }
    }
}

class ImageViewerBind extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentImage:this.props.images.imageIndexInit,
            videoUrl: "",
            src: "",
            error:true,
            loading:false
        }
    }

    componentDidMount(){
        this.renderImage();
    }

    componentDidUpdate(prevProps){
        if(this.props.images.imageIndexInit === prevProps.images.imageIndexInit) return;
        this.setState({ currentImage:this.props.imageIndexInit });
        this.renderImage();
    }
    
    renderImage(){
        this.setState({ error:false, loading:true })
        const image = this.props.images.activeImages[this.state.currentImage];
        if(image.ext === ".webm"){
            const videoUrl = `/api/yoyomi/video?id=${image.tim}&board=${this.props.thread.board}`;
            this.setState({
                videoUrl,
                loading:false
            });
        } else {
            if(this.props.images.imageCache[image.tim] === undefined){
                const url_string = "https://i.4cdn.org/" + this.props.thread.board + "/" + image.tim + image.ext;
                fetch("/api/yoyomi/image/", {
                    method: 'POST',
                    body: JSON.stringify({
                        url: url_string
                    }),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                .then(response => {
                    const s = response.image;
                    const url = "data:image/png;base64," + s;
                    this.props.updateCache(image.tim, url);
                    this.setState({ src:url, loading:false });
                })
                .catch(error => this.setState({ error:true, loading:false }));
            } else {
                this.setState({
                    src:this.props.images.imageCache[image.tim],
                    loading:false
                });
            }
        }
    }

    move(dir){
        if(this.state.loading) return;
        const currentImage = this.state.currentImage + dir;
        this.setState({currentImage}, s => this.renderImage());
    }

    render(){
        const image = this.props.images.activeImages[this.state.currentImage];
        return(
            <div className="image-viewer-outer">
                <div className="image-viewer-inner">
                    <div 
                        className="image-viewer-backdrop"
                        onClick={() => this.props.hideImages()}>
                    </div>
                    <NavButtons
                        currentImage={this.state.currentImage}
                        activeImages={this.props.images.activeImages} 
                        forward={() => this.move(1)}
                        back={() => this.move(-1)}/>
                    <ImageContainer
                        src={this.state.src}
                        videoUrl={this.state.videoUrl}
                        image={image}
                        thread={this.props.thread.thread}
                        board={this.props.thread.board}
                        loading={this.state.loading}
                        error={this.state.error} />
                    <div className="image-location">
                        {this.state.currentImage + 1 + "/" + this.props.images.activeImages.length}
                    </div>
                </div>
            </div>
        );
    }
}

const ImageViewer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageViewerBind);

export { ImageViewer as default }
