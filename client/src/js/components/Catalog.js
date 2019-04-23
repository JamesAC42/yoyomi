import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Loading, Error } from './Loading';

import '../../css/Catalog.css';

export default class Catalog extends Component {

    constructor(props){
        super(props);
        this.state = {
            board: this.props.match.params.board,
            loading:false,
            error:false,
            threads: []
        }
    }

    loadCatalog(board){
        this.setState({board, loading:true, error:false});
        fetch("/api/yoyomi/catalog/", {
            method: 'POST',
            body: JSON.stringify({
		board: this.props.match.params.board
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => {
            this.setState({
                threads:response,
                loading:false
            });
        })
        .catch(error => this.setState({loading:false, error:true}));
    }

    componentDidMount(){
        this.loadCatalog(this.state.board);
    }

    componentDidUpdate(prevProps){
        const board = this.props.match.params.board;
        if(board === prevProps.match.params.board) return;
        this.loadCatalog(board);
    }

    render(){
        if(this.state.loading){
            return <Loading board={this.state.board}/>
        } else {
            if(this.state.error) return <Error />
            return(
                <div className="content">
                    <div className="title">{"/" + this.state.board + "/"} - catalog</div>
                    <hr/>
                    <div className="threads">
                        {
                            this.state.threads.map((thread, index) => {

                                const colors = ["blue-1", "blue-2", "blue-3", "blue-4"];
                                const color = colors[Math.floor(Math.random() * 4)];
                                
                                return(
                                    <div className={"thread " + color} key={index}>
                                        <Link to={"/yoyomi/" + this.state.board + "/thread/" + thread.no}>
                                            <div className="subject" dangerouslySetInnerHTML={
                                                {"__html": thread.sub}
                                            }
                                            title={thread.sub}></div>
                                            <div className="catalog-thread-info" title="Replies / Images">
                                                {thread.replies + " / " + thread.images}
                                            </div>
                                            <div className="preview" dangerouslySetInnerHTML={
                                                {"__html": thread.com}
                                            }>
                                            </div>
                                        </Link> 
                                    </div>  
                                )
                            })
                        }
                    </div>
                </div>
            )
        }
    }
}
