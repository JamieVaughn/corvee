import type { Component } from 'solid-js'
import { Corvee } from './components/corvee'
import { TodoList } from './component-references/todo-list';
import { Counter } from './component-references/counter';
import './style.css'

const App: Component = () => {

  return (
    <>
      {/* <Counter />
      <TodoList /> */}
      <Corvee />
    </>
  )
}

export default App
