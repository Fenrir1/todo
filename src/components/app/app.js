import React, { Component } from 'react';
import uuid from "uuid";

import TodoService from '../../services/todo-service';

import AppHeader from '../app-header';
import SearchPannel from '../search-pannel';
import ItemStatusFilter from '../item-status-filter';
import TodoList from '../todo-list';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {

    maxId = 100;

    state = {
        todoService: new TodoService(),
        term: '',
        sort: false, // true = az, false = za
        filter: 'all', // active, all, done
        todoData: [
            this.createTodoItem('a task'),
            this.createTodoItem('b task'),
            this.createTodoItem('c task'),
        ]
    };

    componentDidMount() {
        const storedData = this.state.todoService.getResource();
        storedData && this.setState({
            todoData: storedData
        });
    }    

    componentDidUpdate(nextProps, nextState) {
        this.state.todoService.setResource(nextState.todoData);
    }    

    createTodoItem(label) {
        return {
            label,
            important: false,
            done: false,
            id: uuid.v1()
        }
    };

    addItem = (text) => {
        const newItem = this.createTodoItem(text);
        this.setState(({ todoData }) => {
            const newArr = [ ...todoData, newItem ];
            return {
                todoData: newArr
            }
        });        
    };

    deleteItem = (id) => {
        this.setState(({ todoData }) => {
            const idx = todoData.findIndex((el) => el.id===id);
            const newArr = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1)
            ];
            return {
                todoData: newArr
            }
        });
    };

    editItem = (id, text) => {
        this.setState(({ todoData }) => {
            const idx = todoData.findIndex((el) => el.id===id);
            const oldItem = todoData[idx];
            const newItem = { ...oldItem, label: text};
            const newArr = [
                ...todoData.slice(0, idx),
                newItem,
                ...todoData.slice(idx + 1)
            ];
            return {
                todoData: newArr
            }
        });
    };
    
    onSearchChange = (term) => {
        this.setState({ term });
    };

    onFilterChange = (filter) => {
        this.setState({ filter });
    };

    toggleSort = () => {
        this.setState(({ sort }) => {
            return {
                sort: !sort
            }
        });
    };

    applySort = () => {
        this.setState(({ todoData, sort }) => {
            let newArr = todoData;
            if (sort) { 
                newArr.sort(function(a, b){
                    if(a.label < b.label) { return -1; }
                    if(a.label > b.label) { return 1; }
                    return 0;
                });
            } else { 
                newArr.sort(function(a, b){
                    if(a.label < b.label) { return 1; }
                    if(a.label > b.label) { return -1; }
                    return 0;
                });
            }

            return {
                todoData: newArr
            }
        });       

    }

    toggleProperty(arr, id, propName) {
        const idx = arr.findIndex((el) => el.id===id);
        const oldItem = arr[idx];
        const newItem = { ...oldItem, [propName]: !oldItem[propName]};
        return [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ];
    };

    onToggleImportant = (id) => {
        this.setState(({ todoData }) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            }
        });
    };

    onToggleDone = (id) => {
        this.setState(({ todoData }) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            }
        });
    };

    filter(items, filter) {
        switch(filter) {
            case 'all': 
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case 'done':
                return items.filter((item) => item.done);
            default:
                return items;
        }
    };

    search(items, term) {
        if (term.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.label.toString()
                .toLowerCase()
                .indexOf(term.toLowerCase()) > -1;
        });
    };

    render() {

        const { todoData, term, sort, filter } = this.state;
        const sortIcon = sort ? "fa fa-sort-alpha-asc" :
                                "fa fa-sort-alpha-desc";

        const visibleItems = this.filter(
            this.search(todoData, term), filter
        );

        if (sort) { 
            visibleItems.sort((a, b) => {
                if(a.label.toLowerCase() < b.label.toLowerCase()) { return -1; }
                if(a.label.toLowerCase() > b.label.toLowerCase()) { return 1; }
                return 0;
            });
        } else { 
            visibleItems.sort((a, b) => {
                if(a.label.toLowerCase() < b.label.toLowerCase()) { return 1; }
                if(a.label.toLowerCase() > b.label.toLowerCase()) { return -1; }
                return 0;
            });
        };

        const doneCount = todoData
                            .filter((el) => el.done).length;
        
        const todoCount = todoData.length - doneCount;
  
        return (
            <div className="container todo-app" >
                <AppHeader 
                    toDo={ todoCount } 
                    done={ doneCount }
                />  
                <div className="top-panel d-flex">
                    <button 
                        className="btn btn-info"
                        title="Swith sorting"
                        onClick={ this.toggleSort }
                    >
                        <i className={ sortIcon }></i>
                    </button>
    
                    <SearchPannel 
                        onSearchChange={ this.onSearchChange } 
                    />
                    <ItemStatusFilter
                        filter={ filter }
                        onFilterChange={ this.onFilterChange }
                    />   
                </div>
                <TodoList 
                    todos={ visibleItems } 
                    onDeleted={ this.deleteItem }
                    onEdited={ this.editItem }
                    onToggleImportant={ this.onToggleImportant }
                    onToggleDone={ this.onToggleDone }
                />

                <ItemAddForm 
                    onItemAdded={ this.addItem }
                />
            </div>         
        ); 
    }
};
