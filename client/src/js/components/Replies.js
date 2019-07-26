import React, { Component } from 'react';
import { connect } from 'react-redux';

import Post from './Post';

import {
    repliesActions
} from '../actions/actions.js';

import arrow from '../../images/icons/arrow-left-96.png'

import '../../css/Reply.css';

const mapStateToProps = (state, props) => ({
    thread: state.thread,
    replies: state.replies
})

const mapDispatchToProps = {
    hideReplies: repliesActions.hideReplies,
    updateReplies: repliesActions.updateReplies
}

class ReplyDialogBind extends Component {
    
    moveUpReplies(){
        if(this.props.replies.replyStack.length < 2){
            this.props.hideReplies();
        } else {
            const stack = this.props.replies.replyStack;
            const source = stack[stack.length - 2];
            let replies;
            for(let p in this.props.thread.posts){
                if(this.props.thread.posts[p].no === source){
                    replies = this.props.thread.posts[p].replies;
                }
            }
            let newStack = [...stack];
            newStack.splice(newStack.length - 1, 1);
            this.props.updateReplies(replies, newStack);
        }
    }

    render(){
        const posts = this.props.replies.replies.map(reply => {
            for(let post in this.props.thread.posts){
                if(this.props.thread.posts[post].no === reply){
                    return this.props.thread.posts[post]
                }
            }
            return null;
        });
        return(
            <div className="reply-dialog-outer">
                <div className="reply-dialog-inner">
                    <div 
                        className="reply-dialog-backdrop"
                        onClick={() => this.props.hideReplies()}></div>
                    <div 
                        className="reply-back-btn" 
                        onClick={() => this.moveUpReplies()}>
                        <div className="reply-back-btn-inner">
                            <img src={arrow} alt="Back" />
                        </div>
                    </div>
                    <div className="reply-dialog">
                        <div className="reply-dialog-content">
                            {
                                posts.map((post, index) => 
                                    <Post
                                        key={index}
                                        index={index}
					board={this.props.thread.board}
                                        post={post}
                                        isReply={true}/>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const ReplyDialog = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReplyDialogBind);

export { ReplyDialog as default }
