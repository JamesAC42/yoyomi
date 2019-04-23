import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import '../../css/Sidebar.css';

const mapStateToProps = (state, props) => ({
    background: state.background
})

class BoardItem extends Component {

    render(){
        if(!this.props.board.ws && !this.props.shownsfw) return null;
        return(
            <li>
                <Link to={"/yoyomi/board/" + this.props.board.board}>
                    {this.props.board.title}
                </Link>
            </li>   
        )
    }

}

class SidebarBind extends Component {

    constructor(props){
        super(props);
        this.state = {
            show_nsfw: false,
            boards: [],
            background: ''
        }
    }

    componentDidMount(){
        fetch("/api/yoyomi/boards", {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => {
            this.setState({
                boards:response
            })
        })
        .catch(error => console.error('Error:', error));
    }

    componentDidUpdate(prevProps){
        if(this.props.background === prevProps.background) return;
        this.setState({background: this.props.background});
    }

    render(){
        const style = {
            backgroundImage: "url('/yoyomi/bg/" + this.state.background + "')" 
        }
        return(
            <div className="sidebar">
                <div className="sidebar-inner">
                    <div className="list-container">
                        <div className="sidebar-title">
                            yoyomi
                        </div>
                        <div className="toggle-nsfw">
                            <div className="toggle-nsfw-inner"
                                onClick={() => { 
                                    this.setState({show_nsfw: !this.state.show_nsfw})
                                }}
                            >nsfw: {this.state.show_nsfw ? "hide" :"show"}</div>
                        </div>
                        <ul>
                            {
                                this.state.boards.map((board, index) => 
                                    <BoardItem 
                                        key={index}
                                        board={board}
                                        shownsfw={this.state.show_nsfw}/>
                                )
                            }
                        </ul>
                    </div>
                    <div 
                        className="sidebar-bg"
                        style={style}>
                    </div>
                </div>
            </div>
        )
    }
}

const Sidebar = connect(
    mapStateToProps
)(SidebarBind);

export { Sidebar as default } 
