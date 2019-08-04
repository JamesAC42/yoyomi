import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ReplyDialog from './Replies';
import ImageViewer from './ImageViewer';
import { Loading, Error } from './Loading';
import Post from './Post';

import {
    savedThreadsActions,
    threadActions,
    imagesActions
} from '../actions/actions.js';

import '../../css/Thread.css';

import sync from '../../images/icons/sync-100.png';

const mapStateToProps = (state, props) => ({
    savedThreads: state.savedThreads,
    thread: state.thread,
    replies: state.replies,
    images: state.images
})

const mapDispatchToProps = {
    saveThread: savedThreadsActions.saveThread,
    unsaveThread: savedThreadsActions.unsaveThread,
    setBoard: threadActions.setBoard,
    setThread: threadActions.setThread,
    setPosts: threadActions.setPosts,
    clearCache: imagesActions.clearCache
}

class PostReply extends Component {
    render(){
        const replySource = this.props.replySource;
        if(replySource === "") return;
        const posts = this.props.posts;
        let post;
        for(let p in posts){
            if(posts[p].no === parseInt(replySource))
                post = posts[p];
        }
        return (
            <Post 
                index={1}
                post={post}
                isReplySource={true}
                isReply={false} 
                position={this.props.position}/>
        )
    }
}

class ThreadBind extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: false,
            refreshDown: false
        }
    }

    loadThread(board, thread, showLoading){

        this.setState({ error: false });

        if(showLoading) this.setState({ loading: true })
        fetch("/api/yoyomi/thread/", {
            method: 'POST',
            body: JSON.stringify({
                board,
                thread
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => {
            this.props.setPosts(response);
            this.setState({ loading:false });
        })
        .catch(error => this.setState({ error:true, loading:false }));
    }

    componentDidMount(){
        const board = this.props.match.params.board;
        const thread = this.props.match.params.thread;
        this.props.setBoard(board);
        this.props.setThread(thread);
        this.loadThread(board, thread, true);
    }

    componentDidUpdate(prevProps){
        const thread = this.props.match.params.thread;
        const board = this.props.match.params.board;
        if(thread === prevProps.match.params.thread) return;
        this.props.clearCache();
        this.props.setBoard(board);
        this.props.setThread(thread);
        this.loadThread(board, thread, true);
    }

    isSaved(){
        for(let thread in this.props.savedThreads){
            if(this.props.savedThreads[thread].no === parseInt(this.props.thread.thread))
                return true;
        }
        return false;
    }

    handleSaveThread(){
        if(this.isSaved()){
            this.unsaveThread();
        } else {
            this.saveThread();
        }
    }

    saveThread(){
        const no = this.props.thread.posts[0].no;
        const board = this.props.thread.board;
        let title;
        if(this.props.thread.posts[0].sub){
            title = this.props.thread.posts[0].sub;
        } else {
            title = this.props.thread.posts[0].com.substring(0,100);
        }
        const thread = {
            board,
            no,
            title
        }
        this.props.saveThread(thread);

        const newSavedThreads = [...this.props.savedThreads, thread];
        window.localStorage.setItem("savedThreads", JSON.stringify(newSavedThreads));
    }

    unsaveThread(){
        let index;
        for(let thread in this.props.savedThreads){
            if(this.props.savedThreads[thread].no === parseInt(this.props.thread.thread))
                index = thread;
        }
        this.props.unsaveThread(index);
    }

    toggleRefreshDown(){
        this.setState({ refreshDown: true });
	setTimeout(() => { this.setState({ refreshDown: false }) }, 400);
    }

    render(){
        if(this.state.loading){
            return <Loading />
        } else {
            if(this.state.error) return <Error board={this.props.thread.board}/>

            let images;
            if(this.props.thread.posts.length)
                images = this.props.thread.posts[0].images ? 
                    this.props.thread.posts[0].images : "0";
            return(
                <div>
                    {
                        this.props.images.imageViewerVisible && 
                        <ImageViewer/>
                    }
                    {
                        this.props.replies.repliesVisible &&
                        <ReplyDialog /> 
                    }
                    {
                        this.props.replies.replySourceVisible &&
                        <PostReply 
                            replySource={this.props.replies.replySource}
                            posts={this.props.thread.posts} 
                            position={this.props.replies.replySourcePosition}/>
                    }
                    <div className="content">
                        <div className="thread-header">
                            <div className="back-btn">
                                <Link to={"/yoyomi/board/" + this.props.thread.board}>
                                    &#60;&#60;Back
                                </Link>
                            </div>
                            <div className="spacer"></div>
                            <div 
                                className={
                                    this.isSaved() ? 
                                    "save-thread saved" : "save-thread"
                                }
                                onClick={() => this.handleSaveThread()}>
                                {this.isSaved() ? "Saved" : "Save"}
                            </div>
                            <div className="thread-info" title="Replies / Images">
                                {this.props.thread.posts.length + " / " + images}
                            </div>
                        </div>
                        {
                            this.props.thread.posts.map((post, index) => 
                                <Post
                                    key={index}
                                    index={index}
                                    post={post}
                                    board={this.props.thread.board}
                                    isReply={false}/>
                            )
                        }
                        <div className="refresh-btn-outer">
                            <img 
                                src={sync}
                                alt="REFRESH" 
                                onMouseDown={e => this.toggleRefreshDown()}
                                onClick={
                                    () => this.loadThread(
                                        this.props.thread.board,
                                        this.props.thread.thread,
                                        false
                                    )
                                }
                                className={this.state.refreshDown ? "refresh-btn refresh-spin" : "refresh-btn"}/>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

const Thread = connect(
    mapStateToProps,
    mapDispatchToProps
)(ThreadBind);

export { Thread as default }

