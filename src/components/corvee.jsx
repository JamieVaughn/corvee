import styles from "./style.module.css";
import { createEffect, createSignal, mergeProps, ErrorBoundary } from "solid-js";

import { Difficulty } from './difficultyMenu'
import { TechTree } from "./techtree";
import { World } from "./world";
import { initResources } from "../data/pieces";

// const POSITION = {x: 0, y: 0}

export function Corvee() {
  // signals
  const positionOne = 0
  const [playing, setPlaying] = createSignal(true)
  const [delay, setDelay] = createSignal(1000)
  const [dimension, setDimension] = createSignal(8);
  // derived signals
  const resources = () => initResources(dimension());
  const positionTwo = () => dimension() ** 2 -1

  const board = Array(dimension() ** 2)
                      .fill(0)
                      .map(() => ({ type: "c", total: 0, player: 1 }));
  // const [dragState, setDragState] = createSignal({
  //     isDragging: false,
  //     origin: POSITION,
  //     translation: POSITION
  // })
  // setDragState(state => ({
  //     isDragging: true,
  //     origin: {x: clientX, y: clientY}
  // }))

  

  // const panScreen = useCallback(({clientX, clientY}) => {
  //     // console.log(clientX, clientY)
  //     if(clientX ===  0) {
  //         // console.log(board.current.style.transform)
  //         // console.log(board.current.style.transform.match(/\d/))
  //         if(!board.current.style.transform) {
  //             board.current.style.transform = 'translateX(1px)'
  //         }
  //         let newPos = board.current.style.transform.replace(/\d/, str => {
  //             // console.log(str)
  //             // console.log(`translateX(${str ? Number(str) + 1 : 1 }px)`)
  //           return `translateX(${str ? Number(str) + 1 : 1 }px)`
  //         })
  //         board.current.style.transform = newPos
  //     }
  //     if(clientX >= window.innerWidth) {
  //         // console.log(window.screenY, board.current)
  //     }
  //     if(clientY === 0) {
  //         // console.log(board.current.style.transform.match(/\d/))
  //         let newPos = board.current.style.transform.replace(/\d/, str => `translateY(${Number(str) + 1}px)`)
  //         board.current.style.setPropertyValue('transform', newPos)
  //     }
  //     if(clientX >= window.innerHeight) {
  //         // console.log(window.screenY, board.current)
  //     }
  // })
  // useEventListener('mousemove', panScreen)

  // Drag Event Handlers
  // const cursor = useMemo(() => ({
  //     cursor: dragState.isDragging ? 'e-resize' : 'grab',
  // }), [dragState.isDragging, dragState.translation])
  // const handleMouseMove = useCallback(({clientX, clientY}) => {
  //     const translation = {
  //         x: clientX - dragState.origin.x,
  //         y: clientY - dragState.origin.y
  //     }
  //     setDragState(state => ({
  //         ...state,
  //         translation
  //     }))
  // }, [dragState.origin])
  // const handleMouseUp = useCallback(() => {
  //     setDragState(state => ({
  //         ...state,
  //         isDragging: false
  //     }))
  // }, [])
  // useEffect(() => {
  //     if(dragState.isDragging) {
  //         window.addEventListener('mousemove', handleMouseMove)
  //         window.addEventListener('mouseup', handleMouseUp)
  //     } else {
  //         window.removeEventListener('mousemove', handleMouseMove)
  //         window.removeEventListener('mouseup', handleMouseUp)
  //     }
  //     setDragState(state => ({...dragState, translation: POSITION}))
  // }, [dragState.isDragging, handleMouseMove, handleMouseUp])

  // createEffect(() => {
  //   console.log('state', dimension(), positionTwo(), resources())
  // })

  const [count, setCount] = createSignal(0);

  setInterval(() => {
    setCount(prev => playing() ? prev + 1 : prev)
  }, 1000)

  const getMinutes = () => {
    const mins = count()/60
    return mins > 1 ? mins.toFixed(0) : '00'
  }
  const getSeconds = () => {
    const sec = count()%60 
    return sec > 9 ? sec : '0'+String(sec)
  }

  return (
    <>
      <section class={styles.kings}>
        <h1 class={styles.title}>King's Corvée</h1>
        <h6 class='center'>A Cooldown-based Strategy game.</h6>
        <div class='flex'><span>{getMinutes()}:{getSeconds()}</span><button onClick={() => setPlaying(p => !p)}>{playing() ? 'Pause' : 'Resume'}</button></div>
        <Difficulty setDimension={setDimension} />
        <span><TechTree /></span>
      </section>
      <ErrorBoundary fallback={err => <div>{JSON.stringify(err)}</div>}>
        <World delay={delay()} dimension={dimension()} board={board} resources={resources()} playing={playing()}/>
      </ErrorBoundary>
    </>
  );
}
