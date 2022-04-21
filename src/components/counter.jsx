import { createSignal, createEffect } from "solid-js";

export const Counter = () => {
  const [count, setCount] = createSignal(0);
  const [text, setText] = createSignal('count');
  const [playing, setPlaying] = createSignal(true)

  setInterval(() => {
    setCount(prev => playing() ? prev + 1 : prev)
  }, 1000)

  createEffect(() => {
    console.log(`counter component ran ${playing() ? count() : 'paused'} times`)
  })

  const pause = () => setPlaying(prev => !prev)

  return (
    <>
      <input 
        onChange={e => setText(e.target.value + "'")} // only fires after input loses focus
        onInput={e => setText(e.target.value)} // fires after every input event (aligned with native API)
        />
        <br/>
      <span>The {text()} is: {count()}</span>
      <button onClick={pause}>{playing() ? 'Pause' : 'Play'}</button>
    </>
  )
}
