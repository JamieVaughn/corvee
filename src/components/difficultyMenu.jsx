import { createEffect } from "solid-js";
import styles from './style.module.css'

export const Difficulty = (props) => {

  const handleDifficulty = (e) => {
    if (e.target.value) {
      props.setDimension(Number(e.target.value));
    }
  };
  const handleStart = (e) => {
    e.preventDefault();
    props.setState(state => {
      return mergeProps({
        state, 
        positionTwo: props.dimension ** 2 - 1,
        matrix: Array(props.dimension ** 2)
        .fill(0)
        .map(() => ({ type: "c", total: 0, player: 1 }))
      })
    })
  };

  createEffect(() => {
    document.documentElement.style.setProperty(
      "--grid-columns",
      String(props.dimension)
    );
    document.documentElement.style.setProperty(
      "--grid-lines",
      String(props.dimension)
    );
  });

  return (
    <form class={styles.settings}>
      Choose difficulty:
      <label for="easy" onClick={handleDifficulty}>
        Easy
        <input type="radio" id="easy" name="difficulty" value="8" checked />
      </label>
      <label for="medium" onClick={handleDifficulty}>
        Medium
        <input type="radio" id="medium" name="difficulty" value="12" />
      </label>
      <label for="hard" onClick={handleDifficulty}>
        Hard
        <input type="radio" id="hard" name="difficulty" value="20" />
      </label>
      <button type="button" class={styles.startBtn} onClick={handleStart}>
        Start Game
      </button>
    </form>
  );
}
