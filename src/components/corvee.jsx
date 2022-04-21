import styles from "./style.module.css";
import { createEffect, createSignal, mergeProps } from "solid-js";
// import useEventListener from "../../hooks/useEventListener";

import { Difficulty } from './difficultyMenu'
import { World } from "./world";
import { units, resources } from "../data/pieces";
import { Tooltip } from "./tooltip";

// const POSITION = {x: 0, y: 0}

export function Corvee() {
  const [dimension, setDimension] = createSignal(8);
  let resource = resources(dimension());
  const [state, setState] = createSignal({
    delay: 1000,
    positionOne: 0,
    positionTwo: dimension() ** 2 - 1,
    resources: resource,
    matrix: Array(dimension() ** 2)
      .fill(0)
      .map(() => ({ type: "c", total: 0, player: 1 })),
  });
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
  const useList = (unit) => {
    return [
      `Attack: ${unit.attack}`,
      `Defense: ${unit.defense}`,
      `Speed: ${unit.speed}`,
      `Range: ${unit.range ?? 1}`,
      `Unit Cap: ${unit.cap}`,
      `Cooldown: ${unit.cooldown}`,
      " --- ",
      `Abilities: `,
      unit.abilities.join(", "),
    ].filter((i) => !!i);
  };
  return (
    <>
      <section class={styles.kings}>
        <h1 class={styles.title}>King's Corvée</h1>
        <Difficulty dimension={dimension()} setDimension={setDimension} setState={setState} />
        <p class={styles.description}>
          A Cooldown-based Strategy game. Mouse over to see unit stats below:
        </p>
        <div class={styles.guide}>
          {Object.values(units).map((u) => (
            <Tooltip class={styles[u.name]} content={useList(u)}>
              <p class={u.name}>
                {u.name} &#x200B;
                <span
                  class={styles[u.css]}
                  role="img"
                  aria-label={u.name + "-icon"}
                >
                  &#x200B; {u.icon}
                </span>
              </p>
            </Tooltip>
          ))}
        </div>
      </section>
      <World dimension={dimension()} {...state()} />
    </>
  );
}
