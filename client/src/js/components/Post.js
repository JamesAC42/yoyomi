import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    repliesActions,
    imagesActions
} from '../actions/actions.js'

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
                        onClick={() => this.showImages()}>
                        Show Image 
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

export default class Post extends Component {

    render(){
        let classes = "post";
        if(this.props.isReply){
            classes += " post-reply";
        } else {
            if(this.props.index === 0) classes += " op";
        }
        return(
            <div 
                id={"p" + this.props.post.no} 
                className={classes}>
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
                    post={this.props.post}
                    index={this.props.index}
                    hasImage={this.props.post.tim !== undefined}/>
            </div>
        )
    }

}