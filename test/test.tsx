"use client";

import React, { useState, useRef } from "react";
import styles from "./test.module.css";

export default function Test(): JSX.Element {
  type TodoItem = {
    id: number;
    text: string;
    editing: boolean;
    complete: boolean;
  };

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [isAddingNewTodo, setIsAddingNewTodo] = useState<boolean>(false);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const handleAddEmptyTodo = () => {
    // If we're already adding a todo or there's an empty one being edited, don't add another
    const hasEmptyTodo = todos.some(
      (todo) => todo.editing && todo.text.trim() === ""
    );

    if (isAddingNewTodo || hasEmptyTodo) {
      window.alert(
        "Please complete the current empty item before adding a new one."
      );
      return;
    }

    // Set flag to indicate we're adding a new todo
    setIsAddingNewTodo(true);
  };

  const handleCreateNewTodo = (text: string) => {
    if (!text.trim()) {
      window.alert("Todo text cannot be empty.");
      setIsAddingNewTodo(false);
      return;
    }

    // Add a new todo with the provided text
    setTodos([
      ...todos,
      { id: Date.now(), text, editing: false, complete: false },
    ]);
    setIsAddingNewTodo(false);
  };

  const handleEdit = (id: number, replacement: string) => {
    if (replacement.trim() === "") {
      window.alert("Todo text cannot be empty.");

      // Set editing to false but keep the original text
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, editing: false } : todo
        )
      );
      return;
    }

    // Save the edited todo
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: replacement, editing: false } : todo
      )
    );
  };
  const handleComplete = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          if (!todo.text.trim()) {
            window.alert("Cannot mark an empty to-do item as complete.");
            return todo;
          }
          return { ...todo, complete: !todo.complete };
        }
        return todo;
      })
    );
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedTodos = todos.filter((todo) => todo.complete);

  return (
    <div
      className={styles.container}
      onDoubleClick={(e) => {
        if (e.target === e.currentTarget) {
          handleAddEmptyTodo();
        }
      }}
    >
      <h1 className={styles.title}>To Do List</h1>
      <p className={styles.subtitle}>
        Double click or click "Add new todo" button for input
      </p>
      <p className={styles.subtitle}>
        Press Enter or click anywhere empty to save your input
      </p>
      {/* Add a dedicated button for adding new todos */}
      <div className={styles.addButtonContainer}>
        <button
          className={styles.addButton}
          onClick={handleAddEmptyTodo}
          aria-label="Add new todo"
        >
          + Add New Todo
        </button>
      </div>
      {/* New Todo Input - Only shown when isAddingNewTodo is true */}
      {isAddingNewTodo && (
        <div className={styles.todoRow}>
          <label className={styles.checkboxContainer}>
            <input type="checkbox" disabled className="checkbox" />
            <span className="checkmark" />
          </label>
          <input
            ref={newTodoInputRef}
            className={styles.textInput}
            placeholder="Enter new todo..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateNewTodo(e.currentTarget.value);
              } else if (e.key === "Escape") {
                setIsAddingNewTodo(false);
              }
            }}
            onBlur={(e) => {
              handleCreateNewTodo(e.target.value);
            }}
          />
        </div>
      )}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.todoRow}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={() => handleComplete(todo.id)}
                className="checkbox"
              />
              <span className="checkmark" />
            </label>

            {todo.editing ? (
              <input
                defaultValue={todo.text}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEdit(todo.id, e.currentTarget.value);
                  }
                }}
                onBlur={(e) => handleEdit(todo.id, e.target.value)}
                autoFocus
                className={styles.textInput}
              />
            ) : (
              <>
                <span
                  className={styles.displayText}
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
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Completed Items Section */}
      <hr style={{ margin: "20px 0" }} />
      <div style={{ marginBottom: "10px" }}>
        <span>{`Completed Items: ${completedTodos.length}`}</span>
        <button
          className={styles.hideButton}
          onClick={() => setShowCompleted((prev) => !prev)}
        >
          {showCompleted ? "Hide" : "Show All"}
        </button>
      </div>

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
              <span className={styles.completedText}>{todo.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
