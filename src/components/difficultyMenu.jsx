import styles from './style.module.css'

export const Difficulty = (props) => {

  const setDOMDimension = num => {
    props.setDimension(Number(num));
    document.documentElement.style.setProperty(
      "--grid-columns",
      String(num)
    );
    document.documentElement.style.setProperty(
      "--grid-lines",
      String(num)
    );
  }
  
  const handleDifficulty = (e) => {
    e.preventDefault()
    for (const input of e.target) {
      if(input.checked) {
        setDOMDimension(input.value)
      }
    }
  };

  return (
    <form class={styles.settings} onSubmit={handleDifficulty}>
      Choose difficulty:
      <label for="easy">
        Easy
        <input type="radio" id="easy" name="difficulty" value="8" checked />
      </label>
      <label for="medium">
        Medium
        <input type="radio" id="medium" name="difficulty" value="12" />
      </label>
      <label for="hard">
        Hard
        <input type="radio" id="hard" name="difficulty" value="20" />
      </label>
      <button type="submit" class={styles.startBtn} >
        Start Game
      </button>
    </form>
  );
}
