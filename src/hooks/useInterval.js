// import { useEffect, useRef } from "react";
import { createEffect, createSignal, onCleanup } from 'solid-js'

// The React Hooks way to setup a setInterval without memory leaks

// function reactuseInterval(callback, delay) {
//   const savedCallback = useRef();

//   // Remember the latest callback.
//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);

//   // Set up the interval.
//   useEffect(() => {
//     function tick() {
//       savedCallback.current();
//     }
//     if (delay !== null) {
//       const id = setInterval(tick, delay);
//       return () => clearInterval(id);
//     }
//   }, [delay]);
// }

export const useInterval = (callback, delay) => {
  return
  const [count, setCount] = createSignal(0)
  const interval = setInterval(() => {
    setCount(prev => prev + 1)
    callback()
  }, delay)
  createEffect(() => {
    console.log('interval')
  })
  onCleanup(() => {
    clearInterval(interval)
  })
  return count
}
