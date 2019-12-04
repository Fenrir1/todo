import React, { Component } from 'react';

import './todo-list-item.css';

export default class TodoListItem extends Component {

    render() {
        const { label, 
                important, 
                done, 
                onEdited, onDeleted, onToggleImportant, onToggleDone
            } = this.props;

        let className = 'todo-list-item';
        if (done) {
            className += ' done';
        }
        if (important) {
            className += ' important';
        }
    
        return (
            <span className={ className } >
                <input 
                    className="todo-list-item-label"
                    onChange={ (e) => onEdited( e.target.value ) }
                    value={ label } 
                />
    
                <button
                    className="btn btn-outline-danger" 
                    title="Delete"
                    onClick={ onDeleted  }
                >
                    <i className="fa fa-trash"></i>
                </button>
                <button 
                    className="btn btn-outline-info"
                    title="Mark as important"
                    onClick={ onToggleImportant }
                >
                    <i className="fa fa-exclamation"></i>
                </button>
                <button 
                    className="btn btn-outline-success"
                    title="Mark as completed"
                    onClick={ onToggleDone }
                >
                    <i className="fa fa-check"></i>
                </button>
            </span>    
        );

    }
}
