import { For, createSignal } from 'solid-js'
import { handleFallback } from '../helpers'

type Todo = { id: number, text: string, completed: boolean };

export const TodoList = () => {
  let input;
  let todoId = 0;
  const [todos, setTodos] = createSignal<Todo[]>([]);
  const addTodo = (text: string) => {
    setTodos([...todos(), { id: ++todoId, text, completed: false }]);
  };
  const toggleTodo = (id: number) => {
    setTodos(
      todos().map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };
  

  const handleSubmit = e => {
    if (!input.value.trim()) return;
    if(!e.key || e.key === 'Enter') {
      addTodo(input.value);
      input.value = '';
    }
  }

  return (
    <>
      <div>
        <input 
          placeholder="new todo here" 
          ref={input} 
          onKeyDown={handleSubmit}
        />
        <button
          onClick={handleSubmit}
        >
          Add Todo
        </button>
      </div>
      <For each={todos()} children={handleFallback} >
        {(todo: Todo, index: Accessor<number>) => {
          const { id, text } = todo;
          return (
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onchange={[toggleTodo, id]}
              />
              <span
                style={{
                  'text-decoration': todo.completed ? 'line-through' : 'none',
                }}
              >
                {text}
              </span>
            </div>
          );
        }}
      </For>
    </>
  );
};
