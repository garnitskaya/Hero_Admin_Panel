import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import heroes from './../reducers/heroes';
import filters from './../reducers/filters';

const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action);
};

const enhancer = (createStore) => (...arg) => {
    const store = createStore(...arg);

    const oldDispatch = store.dispatch;//сохраняем оригинальный dispatch, который принимал в себя только объект
    store.dispatch = (action) => { //взяли оригинальный dispatch и перезаписали его
        if (typeof action === 'string') { //если action будет строкой
            return oldDispatch({ //вызываем оригинальный dispatch и в него передаём объект 
                type: action
            })
        }
        return oldDispatch(action);//если пришла не строка возвращаем dispatch
    }
    return store;
}

const store = createStore(
    combineReducers({ heroes, filters }),
    compose(applyMiddleware(stringMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;