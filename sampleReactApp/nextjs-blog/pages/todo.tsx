export type TodoProps = {
    todos: string[];
    addTodo: () => void;
}

export default function Todo({ todos = [], addTodo }: TodoProps) {
    return <>
        <button onClick={addTodo}>Add todo</button>
        <div>
            {todos.length > 0 && todos.map((t, i) => <p key={i}>{t}</p>)}
        </div>
    </>
}
