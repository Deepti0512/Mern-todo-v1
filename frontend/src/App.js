import "./App.css";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

function App() {
  // const [complete, setComplete] = useState(false);
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const getTodo = async () => {
    await fetch(`${API_BASE}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log(err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id).then((res) =>
      res.json()
    );
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  };
  useEffect(() => {
    getTodo();
  }, []);

  return (
    <div className="App">
      <div className="main-container">
        <h1 id="title">Welcome User</h1>
        <h4>Your Tasks</h4>

        <div className="todos">
          {todos.map((todo) => {
            return (
              <div
                className={"todo" + (todo.complete ? " is-complete" : "")}
                key={todo._id}
                onClick={() => completeTodo(todo._id)}
              >
                <div className="checkbox"></div>
                <div className="todo-text">{todo.text}</div>
                <div
                  className="delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                >
                  X
                </div>
              </div>
            );
          })}
        </div>

        <button className="add-btn" onClick={() => setPopupActive(true)}>
          +
        </button>

        {popupActive && (
          <div className="popup">
            <div className="closePopup" onClick={() => setPopupActive(false)}>
              X
            </div>
            <div className="content">
              <h3>Add Task</h3>
              <input
                type="text"
                className="add-todo-input"
                onChange={(e) => setNewTodo(e.target.value)}
                value={newTodo}
              />
              <div className="button" onClick={addTodo}>
                Create Task
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;