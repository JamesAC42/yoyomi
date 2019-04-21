import React, { Component } from 'react';

import sachiko from '../../images/sachiko_smug.png';

export default class Default extends Component {
    render(){
        return(
            <div>
                <div className="default-title">四 読</div>
                <div className="default-outer">
                    <div className="default-inner">
                        <img src={sachiko} alt="sachiko_smug" />
                    </div>
                </div>
            </div>
        )
    }
}