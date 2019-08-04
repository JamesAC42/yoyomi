import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    repliesActions,
    imagesActions
} from '../actions/actions.js'
import { linkSync } from 'fs';

const mapStateToProps = (state, props) => ({
    thread: state.thread,
    replies: state.replies,
    images: state.images
})

const mapDispatchToProps = {
    showReplies: repliesActions.showReplies,
    updateReplies: repliesActions.updateReplies,
    showImages: imagesActions.showImages
}

class AuxInfoContainerBind extends Component {

    constructor(props){
        super(props);
        this.state = {
            thumbUrl: ""
        }
    }

    handleShowReplies(){
        if(this.props.replies.repliesVisible){
            this.updateReplies();
        } else {
            this.showReplies();
        }
    }

    showReplies(){
        const replies = this.props.post.replies;
        const post = this.props.post.no;
        this.props.showReplies(replies, post);
    }
    
    updateReplies(){
        let newStack = [...this.props.replies.replyStack];
        newStack.push(this.props.post.no);
        const replies = this.props.post.replies;
        this.props.updateReplies(replies, newStack);
    }

    renderThumbnail(){
        const url_string = "https://i.4cdn.org/" + this.props.board + "/" + this.props.post.tim + "s.jpg";
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
                this.setState({ thumbUrl:url });
            })
            .catch(error => console.log(error));
    }

    showImages(){
        let images = [];
        let activeIndex;
        if(this.props.replies.repliesVisible){
            for(let r in this.props.replies.replies){
                const reply = this.props.replies.replies[r];
                for(let p in this.props.thread.posts){
                    const post = this.props.thread.posts[p];
                    if(reply === post.no){
                        if(post.tim !== undefined){
                            const image = {
                                no: post.no,
                                tim: post.tim,
                                ext: post.ext,
                                filename: post.filename
                            }
                            images.push(image);
                            if(parseInt(r) === this.props.index)
                                activeIndex = images.length - 1;
                        }
                    }
                }
            }
        } else {
            for(let p in this.props.thread.posts){
                const post = this.props.thread.posts[p];
                if(post.tim !== undefined){
                    let image = {
                        no: post.no,
                        tim: post.tim,
                        ext: post.ext,
                        filename: post.filename
                    }
                    images.push(image);
                    if(parseInt(p) === this.props.index)
                        activeIndex = images.length - 1;
                }
            }
        }
        this.props.showImages(images, activeIndex);
    }

    render(){
        if((this.props.post.replies.length === 0) && !this.props.hasImage) 
            return null
        return(
            <div className="aux-info-container">
                {
                    (this.props.post.replies.length > 0) &&
                    <div 
                        className="reply-number"
                        onClick={() => this.handleShowReplies()}>
                        {this.props.post.replies.length + " replies"}
                    </div>
                }
                {
                    this.props.hasImage &&
                    <div
                        className="show-image"
                        onMouseEnter={() => this.renderThumbnail()}
                        onClick={() => this.showImages()}>
                        Show {this.props.post.ext === ".webm" ? "Video" : "Image"}
                        <div className="image-thumbnail">
                            <img src={this.state.thumbUrl} alt="Thumbnail" />
                        </div>
                    </div>
                }
                    
            </div>
        )
    }
}

const AuxInfoContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AuxInfoContainerBind);

const mapPostDispatchToProps = {
    showReplySource: repliesActions.showReplySource,
    hideReplySource: repliesActions.hideReplySource
}

class PostBind extends Component {

    constructor(props){
        super(props);
        this.postRef = React.createRef();
    }

    updateReplySource(e){
        const postNumber = e.target.innerHTML.split('&gt;')[2];
        if(postNumber === ""){
            return;
        } else {
            const rect = e.target.getBoundingClientRect();
            const position = {
                x: rect.right,
                y: rect.top
            }
            this.props.showReplySource(postNumber, position);
        }
    }

    bindShowReplySourceActions(){
        const thisPost = document.getElementById("p" + this.props.post.no);
        
        const links = thisPost.getElementsByClassName("quotelink");
        if(links.length){
            for(let i = 0; i < links.length; i++){
                const l = links[i];
                l.addEventListener("mouseenter", this.updateReplySource.bind(this));

                l.addEventListener("mouseleave", e => {
                    this.props.hideReplySource();
                });

                l.addEventListener("click", e => {
                    const postNumber = e.target.innerHTML.split('&gt;')[2];
                    if(postNumber !== ""){
                        document.getElementById("p" + postNumber).scrollIntoView();
                    }
                })
            }
        }

        if(this.props.isReplySource){
            const pos = this.props.position;
            this.postRef.current.style.transform = `translate(${pos.x}px, calc(${pos.y}px - 100%)`;
        }
    }

    componentDidUpdate(){
        this.bindShowReplySourceActions();
    }

    componentDidMount(){
        this.bindShowReplySourceActions();
    }

    render(){
        let classes = "post";
        if(this.props.isReply && !this.props.isReplySource){
            classes += " post-reply";
        } else {
            if(this.props.index === 0) classes += " op";
        }
        if(this.props.isReplySource){
            classes += " reply-source"
        }
        const id = this.props.isReplySource ? "reply-source" : "p" + this.props.post.no;
        return(
            <div 
                id={id} 
                className={classes}
                ref={this.postRef}>
                <div className="header">
                    <span className="subject" dangerouslySetInnerHTML={
                            {"__html": this.props.post.sub}
                        }></span>
                    <span className="name">{this.props.post.name + " "}</span>
                    <span className="time">{this.props.post.now + " "}</span>
                    <span className="number">No. {this.props.post.no}</span>
                </div>
                <div className="comment" dangerouslySetInnerHTML={
                            {"__html": this.props.post.com}
                        }>
                </div>
                <AuxInfoContainer
                    board={this.props.board}
                    post={this.props.post}
                    index={this.props.index}
                    hasImage={this.props.post.tim !== undefined}/>
            </div>
        )
    }
}

const Post = connect(
    null,
    mapPostDispatchToProps
)(PostBind);

export { Post as default }