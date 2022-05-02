import { createSignal, createEffect, Show, ErrorBoundary, on, onCleanup } from "solid-js";
import styles from "./style.module.css";
import { units } from "../data/pieces";

import { AbilityMenu } from "./abilityMenu";
import { UnitCard } from './unitcard'
import { draw, isEdge, growthFactor } from "../helpers";

const decay = false;
// type Props = delay: number, dimension: number, resources: Array<{}>, playing: boolean
export const World = (props) => {
  let world // ref for world component
  // signals
  const [inspect, setInspect] = createSignal(false)
  const [apm, setApm] = createSignal(0) // increment for every user input event
  const [forts, setForts] = createSignal([0]);
  const [muster, setMuster] = createSignal([null, null]); // [index, total]
  const [hasSelection, setHasSelection] = createSignal(false)
  const [active, setActive] = createSignal([]); // Array<{id, type, ability, total?}>
  const [troops, setTroops] = createSignal(
    Array(props.dimension ** 2)
    .fill(0)
    .map(() => ({ type: "c", total: 0, player: 1 }))
  )
  // const [boost, setBoost] = createSignal(1)

  // derived signal
  const mode = () => props.dimension === 8 ? 'easy' : props.dimension === 12 ? 'med' : 'hard'

  createEffect(() => {
    troops()
    if(tick() % 30) return
    console.log(`time: ${tick()}`)
    console.log(`Mustered troops: `, muster())
    console.log(`Activated troops: `, active())
    console.log(`APM: ${(apm() * (60 / tick())).toFixed(1)}`)
  })

  // world clock
  const [tick, setTick] = createSignal(0)
  // setInterval(() => {
  //   if(!props.playing) return;
  //   setTick(tick() + Number(props.playing))
  // }, 3000 || props.delay)
  const drawCallback = () => {
    setTick(tick() + Number(props.playing))
  }

  const animationFrame = draw(0, {drawCallback, fps: 0.33} )

  onCleanup(() => {
    cancelAnimationFrame(animationFrame)
  })

  createEffect(on(tick, (tick) => {
    setTroops(state => {
      return state?.map((unit, id) => {
        let cap = units[unit.type].cap;
        if (unit.total < 0) {
          return (unit.total = 0), unit;
        }
        if (forts().includes(id)) {
          let delta = growthFactor(cap, unit.total);
          unit.total += delta;
          return unit;
        }
        if (decay) {
          return (unit.total -= Math.floor(Math.random() * 1.1)), unit;
        }
        return unit;
      });
    });
  }))

  const useInspect = e => (e.shiftKey) ? setInspect(k => !k) : null

  createEffect(() => {
    if(inspect()) {
      console.log(`World Clock: ${props.playing ? tick() : `paused - ${tick()}`} seconds`)
      console.log("active", active(), troops());
      console.log('resources', props.resources)
      console.log(`board: ${props.dimension}x${props.dimension} => ${troops().length}`)
    }
  })

  const canReach = (pos) => {
    let row = Math.ceil(pos / 8);
    let col = pos % 8;
    let coef = row % 2 === 0 ? -1 : 1;
    if (row % 2 === 0 && col === 0) coef = 1;
    if (row % 2 === 1 && col === 0) coef = 0;
    return [-props.dimension + coef, -props.dimension, -1, 1, props.dimension, props.dimension + coef];
  };
  
  const deployMusteredTroops = (_e, unit, target) => {
    // e.preventDefault();
    setHasSelection(false);
    // console.log('Muster', ...muster())
    // console.log('Target', target, unit)
    const pos = muster()[0];
    console.log('deploy', _e, target)
    if (!(typeof target === "number") || !(typeof pos === "number")) return;
    if (isEdge(pos, target, props.dimension)) return;
    if (
      target === pos ||
      troops()[target].type !== unit.type ||
      troops()[target].total >= units[troops()[target].type].cap
    ) {
      return setMuster([null, null]);
    }
    let delta;
    if (troops()[target].total + unit.total >= units[unit.type].cap) {
      delta = units[unit.type].cap - unit.total;
    }
    const type = muster()[1].type;
    const quantity = muster()[1].total;
    const player = muster()[1].player;
    if (type !== unit.type && player === unit.player) return;
    if (player !== unit.player) return console.log("Battles not yet supported");
    // console.log('edge', isEdge(pos, target, props.dimension), 'same', target === pos)

    if (
      canReach(pos)
        .reduce((acc, cur) => {
          if (isEdge(muster()[0], target, props.dimension)) return acc;
          return [...acc, muster()[0] + cur];
        }, [])
        .includes(target)
    ) {
      setTroops((prev) =>
        prev.map((u, idx) => {
          if (idx === pos) {
            u.total -= delta ?? quantity;
            return u;
          } else if (idx === target) {
            u.total += delta ?? quantity;
            return u;
          } else {
            return u;
          }
        })
      );
      setMuster([null, null]);
    }
  };
  const musterTroops = (unit, id) => {
    console.log(unit, id);
    if (active().find((a) => a.id === id)) return;
    if (typeof id === "number" && unit.total > 0) {
      setMuster([id, unit]);
      setHasSelection(true)
    }
  };
  const activateAbility = (e, unit, id) => {
    e.preventDefault();
    setHasSelection(false)
    console.log(unit, id, units[unit.type].abilities);
    if (active().find((a) => a.id === id)) return;
    let troop = e.currentTarget;
    if (typeof id === "number" && unit.total > 0) {
      setActive([
        ...active(),
        { id, type: unit.type, total: unit.total, ability: "build" },
      ]);
      let cd = Math.random() > 0.5 ? 10 : 2;
      troop.style.setProperty("animation-duration", cd + "s");
      troop.classList.toggle("oncooldown");
      setTimeout(() => {
        setActive((prev) => prev.filter((a) => a.id !== id));
        troop.classList.remove("oncooldown");
      }, cd * 1000);
    }
  };
  const deploymentZones = (target) => {
    if (muster()[0] === null) return "";
    if (muster()[0] === target) return styles.muster;
    if (
      canReach(muster()[0])
        .reduce((acc, cur) => {
          if (isEdge(muster()[0], target, props.dimension)) return acc;
          return [...acc, muster()[0] + cur];
        }, [])
        .includes(target)
    )
      return styles.deploy;
    return "";
  };
  const buildZones = (target) => {
    if (muster()[0] === null) return "";
    if (muster()[0] === target) return styles.muster;
    if (
      canReach(muster()[0])
        .reduce((acc, cur) => {
          if (isEdge(muster()[0], target, props.dimension)) return acc;
          return [...acc, muster()[0] + cur];
        }, [])
        .includes(target)
    ) {
      return styles.build;
    }
    return "";
  };

  const delegateAPM = e => {
    e.preventDefault()
    setApm(apm => apm + 1)
  }

  const handleCellClick = (e, unit, i) => {
    console.log( {i: i(), muster: muster()[0], reach: canReach(muster()[0])})
    if(troops()[i()]?.total === 0 && !canReach(muster()[0]).includes(i())) {
      setMuster([null, null])
      return
    }
    if(muster().every(m => m?.valueOf)) {
      deployMusteredTroops(e, unit, i())
      setMuster([null, null])
    } else {
      musterTroops(unit, i())
    }
  }


  return (
    <div class={styles.worldwrapper} onContextMenu={delegateAPM} onClick={delegateAPM} onDoubleClick={delegateAPM}>
      <div class={styles.world} ref={world}>
        <div class={styles.backboard} />
        <section
          class={`${styles[mode()]} ${styles.grid}`}
          onClick={e => e.shiftKey ? console.log(troops()) : null}
          onContextMenu={(e) => e.preventDefault()}
        >
          <ErrorBoundary fallback={err => err}>
          <For each={troops()} fallback={<span>Troops Lost</span>}>
            {(unit, i) => {
              return (
                <div
                  class={`${styles.cell} ${
                    forts().includes(i()) ? styles.king : ""
                  } ${deploymentZones(i())}`}
                  onClick={(e) => deployMusteredTroops(e, unit, i())}
                  onDragEnd={(e) => {console.log('endcap', e); deployMusteredTroops(e, unit, i()) }}
                  // onDragOver={e => console.log('over', e)}
                  onDragEnter={e => console.log('enter', e)}
                >
                  <Show when={(apm() || tick()) && unit.total > 0} fallback={<span></span>}>
                    <div
                      class={`${styles.troop}`}
                      onClick={(e) => { e.stopPropagation(); musterTroops(unit, i()) }}
                      draggable='true'
                      onDragStart={e => musterTroops(unit, i())}
                      onContextMenu={(e) => activateAbility(e, unit, i())}
                    >
                      <span>{Math.round(troops()[i()].total)}</span>
                      <span class={styles[units[unit.type].css]}>
                        {units[unit.type].icon}
                      </span>
                      {/* <AbilityMenu abilities={units[unit.type].abilities} /> */}
                    </div>
                  </Show>
                  <Show when={typeof props.resources?.[i()] === "string"} fallback={null}>
                    <span class={`${styles.feature} ${props.resources[i()]}`}>
                      {props.resources[i()]}
                    </span> 
                  </Show>
                </div>
              )
            }}
          </For>
          </ErrorBoundary>
        </section>
      </div>
      <div onMouseEnter={useInspect}>
        <Show when={muster().some(m => m)} fallback={<UnitCard empty={true}></UnitCard>}>
          <UnitCard mustered={muster()} />
        </Show>
      </div>
    </div>
  );
}
