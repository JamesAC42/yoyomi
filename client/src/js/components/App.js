import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import Sidebar from './Sidebar';
import Catalog from './Catalog';
import Thread from './Thread';
import Default from './Default';

import bookmark from '../../images/icons/bookmark-96.png';

import '../../css/App.css';
import '../../css/Bookmark.css';

import { connect } from 'react-redux';
import { 
  savedThreadsActions,
  backgroundActions
} from '../actions/actions.js';

const mapStateToProps = (state, props) => ({
  savedThreads: state.savedThreads
})

const mapDispatchToProps = {
  setBookmarks: savedThreadsActions.setBookmarks,
  saveThread: savedThreadsActions.saveThread,
  unsaveThread: savedThreadsActions.unsaveThread
}

class BookmarkBind extends Component {

  unsaveThread(no){
    let index;
    for(let thread in this.props.savedThreads){
      if(this.props.savedThreads[thread].no === parseInt(no)){
        index = thread;
        break;
      }
    }
    index = parseInt(index);
    this.props.unsaveThread(index);
    const newBookmarks = [
      ...this.props.savedThreads.slice(0, index),
      ...this.props.savedThreads.slice(index + 1)
    ]
    window.localStorage.setItem("savedThreads", JSON.stringify(newBookmarks));
  }

  componentDidMount(){
    if(window.localStorage.getItem('savedThreads')){
      this.props.setBookmarks(JSON.parse(window.localStorage.getItem('savedThreads')))
    }
  }

  render(){
    return(
      <div className="bookmark">
        <div className="bookmark-inner">
          <div className="bookmark-btn">
            <div className="bookmark-btn-inner">
              <img src={bookmark} alt="bookmark" />
            </div>
          </div>
          <div className="bookmark-list">
            <div className="bookmark-list-inner">
              {
                this.props.savedThreads.map((thread, index) => 
                  <div className="bookmark-item" key={index}>
                    <div className="bookmark-item-link">
                      <Link title={thread.title} to={"/" + thread.board + "/thread/" + thread.no}>
                        {"/" + thread.board + "/ - " + thread.title}
                      </Link>
                    </div>
                    <div
                      className="bookmark-item-remove"
                      onClick={() => this.unsaveThread(thread.no)}>X</div>
                  </div>
                )
              }
            </div>          
          </div>
        </div>
      </div>
    )
  }
}

const Bookmark = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkBind);

const mapAppDispatchToProps = {
  setBackground: backgroundActions.setBackground
}

class AppBind extends Component {
  componentDidMount(){
    fetch("/getBackground")
    .then(res => res.json())
    .then(response => {
        this.props.setBackground(response.background);
        document.body.style.background = "url(/bg/" + response.background + ")";
        document.body.style.backgroundSize = "100vw auto";
    })
    .catch(error => this.setState({ error:true, loading:false }));
  }
  render() {
    return (
      <div>
        <Bookmark />
        <Sidebar />
        <div className="main-container">
          <div className="main-container-inner">
            <Switch>
              <Route 
                exact 
                path="/board/:board" 
                component={Catalog}/>
              <Route 
                exact
                path="/:board/thread/:thread"
                component={Thread}/>
              <Route
                component={Default}/>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const App = connect(
  null,
  mapAppDispatchToProps
)(AppBind);

export default App;
