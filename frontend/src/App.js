import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import TodoList from './components/TodoList';
import NewTodo from './components/NewTodo';
import UpdateTodo from './components/UpdateTodo';
import CompletedTodos from './components/CompletedTodos';
import IncompleteTodos from './components/IncompleteTodos';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/">Todo List</Link>
            </li>
            <li>
              <Link to="/new">New Todo</Link>
            </li>
            <li>
              <Link to="/completed">Completed Todos</Link>
            </li>
            <li>
              <Link to="/incomplete">Incomplete Todos</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={TodoList} />
          <Route path="/new" component={NewTodo} />
          <Route path="/update/:id" component={UpdateTodo} />
          <Route path="/completed" component={CompletedTodos} />
          <Route path="/incomplete" component={IncompleteTodos} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;