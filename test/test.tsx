"use client";

import React, { useState } from "react";
import styles from "./test.module.css";
import { todo } from "node:test";

export default function Test(): JSX.Element {
  type TodoItem = {
    id: number;
    text: string;
    editing: boolean;
    complete: boolean;
  };

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const handleAddEmptyTodo = () => {
    // Check if there are any empty todos already being edited
    if (todos.some((todo) => todo.editing && todo.text.trim() === "")) {
      setError(
        "Please complete the current empty item before adding a new one."
      );
      return;
    }

    // Clear any existing error and add a new empty todo
    setError(null);
    setTodos([
      ...todos,
      { id: Date.now(), text: "", editing: true, complete: false },
    ]);
  };

  const handleEdit = (id: number, replacement: string) => {
    if (replacement.trim() === "") {
      setError("Todo text cannot be empty."); // Set error if input is empty
      return;
    }

    setError(null); // Clear error if input is valid
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: replacement, editing: false } : todo
      )
    );
  };

  const handleComplete = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, complete: !todo.complete } : todo
      )
    );
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const completedTodos = todos.filter((todo) => todo.complete); // Filter completed items

  return (
    <div
      className={styles.container}
      onDoubleClick={(e) => {
        // Double click to enter a reminder
        if (e.target === e.currentTarget) {
          handleAddEmptyTodo();
        }
      }}
    >
      <h1>To Do List</h1>
      <p>Double click for input</p>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={() => handleComplete(todo.id)}
                className="checkbox"
              />
              <span className="checkmark" />
            </label>

            {todo.editing ? (
              <>
                <input
                  defaultValue={todo.text}
                  onBlur={(e) => handleEdit(todo.id, e.target.value)}
                  autoFocus
                />
                {/* Error Message */}
                {error && <p style={{ color: "red" }}>{error}</p>}
              </>
            ) : (
              <>
                <span
                  onDoubleClick={() =>
                    setTodos(
                      todos.map((t) =>
                        t.id === todo.id ? { ...t, editing: true } : t
                      )
                    )
                  }
                  title="Double click to edit"
                >
                  {todo.text}
                </span>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Divider and Completed Items Section */}
      <hr style={{ margin: "20px 0" }} />
      <div style={{ marginBottom: "10px" }}>
        <span>{`Completed Items: ${completedTodos.length}`}</span>
        <button
          onClick={() => setShowCompleted((prev) => !prev)}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          {showCompleted ? "Hide" : "Show All"}
        </button>
      </div>

      {/* List of Completed Items */}
      {showCompleted && (
        <ul>
          {completedTodos.map((todo) => (
            <li key={todo.id}>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={todo.complete}
                  onChange={() => handleComplete(todo.id)}
                  className="checkbox"
                />
                <span className="checkmark" />
              </label>
              <span>{todo.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
