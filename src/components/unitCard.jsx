import { createSignal, createEffect } from 'solid-js'
import styles from './style.module.css'

// const [trace, setTrace] = createSignal({prev: {}, current: {}})
export const UnitCard = (props) => {
    // setTrace({prev: trace().current, current: props})
    // createEffect(() => {
    //   // const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
    //   //   if (trace().prev[k] !== v) {
    //   //     ps[k] = [trace().current[k], v];
    //   //   }
    //   //   return ps;
    //   // }, {});
    //   // if (Object.keys(changedProps).length > 0) {
    //   //   console.log('Changed props:', changedProps);
    //   // }
    //   console.log('trace', props, trace())
    // });

    console.log(props.mustered)

    if(props.empty) {
      return (
        <section class={styles.unitcard}>
          <div>Select Troops</div>
        </section>
      )
    }

    return (
      <section class={`${styles.unitcard} ${styles.mustered}`}>
        <div>Unit Card</div>
        <div>Stats</div>
        <div>Abilities</div>
        <div>Position: {props.mustered[0]}</div>
        <div>Type: {props.mustered[1]?.type}</div>
        <div>Troops: <span>{Math.round(props.mustered[1]?.total)}</span></div>
      </section>
    )
}
