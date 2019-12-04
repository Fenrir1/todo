export default class TodoService {

    _itemName = 'todoData';

    getResource = () =>  {
        return JSON.parse(localStorage.getItem(this._itemName));
    }


    setResource = (newData) => {
        localStorage.setItem(this._itemName, JSON.stringify(newData) );
        return true;
    };    

};