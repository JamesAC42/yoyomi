import React, { Component } from 'react';
import "../../css/Loading.css";

export class Error extends Component {
    render(){
        return(
            <div className="content">
                <div className="error-outer">
                    <div className="error-inner">
                        Something went wrong.
                    </div>
                </div>
            </div>

        )
    }
}

export class Loading extends Component {
    render(){
        return(
            <div className="content">
                {
                    this.props.board && 
                    <div>
                        <div className="title">{"/" + this.props.board + "/"} - catalog</div>
                        <hr/>
                    </div>
                }
                <div className="loading-outer">
                    <div className="loading">
                        <div className="loading-inner">
                            <div className="loading-ball"></div>
                            <div className="loading-ball"></div>
                            <div className="loading-ball"></div>
                            <div className="loading-ball"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}