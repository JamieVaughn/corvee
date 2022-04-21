import { createSignal, createEffect } from 'solid-js'
import styles from './style.module.css'

const [trace, setTrace] = createSignal({prev: {}, current: {}})
export const UnitCard = (props) => {
    setTrace({prev: trace().current, current: props})
    createEffect(() => {
      // const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      //   if (trace().prev[k] !== v) {
      //     ps[k] = [trace().current[k], v];
      //   }
      //   return ps;
      // }, {});
      // if (Object.keys(changedProps).length > 0) {
      //   console.log('Changed props:', changedProps);
      // }
      console.log('trace', props, trace())
    });

    return (
      <section class={styles.unitcard}>
        <div>Unit Card</div>
        <div>Stats</div>
        <div>Abilities</div>
        {props.children}
      </section>
    )
}
