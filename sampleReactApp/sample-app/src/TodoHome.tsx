
import React from "react";
import Todo from "./Todo";
import { useCallback, useState } from "react";
export default function TodoHome() {

    const [todos, setTodos] = useState(Array<string>);
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount(prevCount => prevCount + 1);
    }

    const addTodo = useCallback(() => {
        console.log("Adding to todo");
        setTodos(t => [...t, "New Todo"]);
    }, [])



    return (
        <>
            <div>Count {count}</div>
            <button onClick={handleIncrement}>Increment</button>

            <Todo todos={todos} addTodo={addTodo}  ></Todo>
        </>
    )
}
