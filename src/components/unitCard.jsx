import { createSignal, createEffect } from 'solid-js'
import { units } from '../data/pieces'
import styles from './style.module.css'

export const UnitCard = (props) => {

    if(props.empty) {
      return (
        <section class={styles.unitcard}>
          <h4>Select Troops</h4>
        </section>
      )
    }
    const unit = units[props.mustered[1]?.type]
    const [total, setTotal] = createSignal(props.mustered[1]?.total)
    createEffect(() => {
      setTotal(props.mustered[1]?.total)
    })


    return (
      <section class={`${styles.unitcard} ${styles.mustered}`}>
        <h3 data-capital>{unit.name}</h3> 
        <span>
          <code>{Math.round(total())} troops @ ({props.mustered[0] % 8},{ Math.floor(props.mustered[0] / 8)})</code>
        </span>
        <Show when={unit.abilities.length} fallback={null}>
          <h4>Abilities: </h4>
          <span>{unit.abilities.join(', ')}</span>
        </Show>
        <h4>Stats:</h4>
        <span>Attack: {unit.attack}, Defense: {unit.defense}, Range: {unit.range}, Speed: {unit.speed}</span>
      </section>
    )
}
