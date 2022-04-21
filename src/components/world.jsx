import { createSignal, Show } from "solid-js";
import styles from "./style.module.css";
import { units } from "../data/pieces";

import { AbilityMenu } from "./abilityMenu";
import { UnitCard } from './unitcard'
import { useInterval } from "../hooks/useInterval";
import useEdge from "../hooks/useEdge";
import useGrowth from "../hooks/useGrowth";

const decay = false;
// type Props = {  delay: number, dimension: number, matrix: number[], positionOne: number, positionTwo: number, resources: [] }
export const World = (props) => {
  let world
  const canReach = (pos) => {
    let row = Math.ceil(pos / 8);
    let col = pos % 8;
    let coef = row % 2 === 0 ? -1 : 1;
    if (row % 2 === 0 && col === 0) coef = 1;
    if (row % 2 === 1 && col === 0) coef = 0;
    return [-props.dimension + coef, -props.dimension, -1, 1, props.dimension, props.dimension + coef];
  };
  // console.log('world', props.resources)
  const [forts, setForts] = createSignal([props.positionOne]);
  const [muster, setMuster] = createSignal([null, null]); // [index, total]
  const [hasSelection, setHasSelection] = createSignal(false)
  const [active, setActive] = createSignal([]); // Array<{id, type, ability, total?}>
  const [troops, setTroops] = createSignal(props.matrix);
  // const [boost, setBoost] = createSignal(1)
  useInterval(() => {
    console.log("active", active());
    setTroops((state) => {
      return state.map((unit, id) => {
        let cap = units[unit.type].cap;
        if (unit.total < 0) {
          return (unit.total = 0), unit;
        }
        if (forts().includes(id)) {
          let delta = useGrowth(cap, unit.total);
          unit.total += delta;
          return unit;
        }
        if (decay) {
          return (unit.total -= Math.floor(Math.random() * 1.1)), unit;
        }
        return unit;
      });
    });
  }, props.delay);

  const deployMusteredTroops = (e, unit, target) => {
    e.preventDefault();
    setHasSelection(false);
    // console.log('Muster', ...muster())
    // console.log('Target', target, unit)
    const pos = muster()[0];
    if (!(typeof target === "number") || !(typeof pos === "number")) return;
    if (useEdge(pos, target, props.dimension)) return;
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
    // console.log('edge', useEdge(pos, target, props.dimension), 'same', target === pos)

    if (
      canReach(pos)
        .reduce((acc, cur) => {
          if (useEdge(muster()[0], target, props.dimension)) return acc;
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
        setactive()((prev) => prev.filter((a) => a.id !== id));
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
          if (useEdge(muster()[0], target, props.dimension)) return acc;
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
          if (useEdge(muster()[0], target, props.dimension)) return acc;
          return [...acc, muster()[0] + cur];
        }, [])
        .includes(target)
    ) {
      return styles.build;
    }
    return "";
  };

  // console.log('world', troops())

  return (
    <div class={styles.worldwrapper}>
      <div class={styles.world}>
        <div class={styles.backboard} />
        <section
          class={styles.grid}
          onDblClick={() => console.log(troops())}
          onContextMenu={(e) => e.preventDefault()}
        >
          <For each={troops()}>
            {(unit, i) => {
              return (
                <div
                  class={`${styles.cell} ${
                    forts().includes(i) ? styles.king : ""
                  } ${deploymentZones(i)}`}
                  onContextMenu={(e) => deployMusteredTroops(e, unit, i)}
                >
                  <Show when={unit.total > 0} fallback={null}>
                    <div
                      class={`${styles.troop}`}
                      onClick={(e) => musterTroops(unit, i)}
                      onContextMenu={(e) => activateAbility(e, unit, i)}
                    >
                      <span>{Math.round(unit.total)}</span>
                      <span class={styles[units[unit.type].css]}>
                        {units[unit.type].icon}
                      </span>
                      <AbilityMenu abilities={units[unit.type].abilities} />
                    </div>
                  </Show>
                  <Show when={typeof props.resources[i] === "string"} fallback={null}>
                    <span class={`${styles.feature} ${props.resources[i]}`}>
                      {props.resources[i]}
                    </span> 
                  </Show>
                </div>
              )
            }}
          </For>
        </section>
      </div>
      <div>
        <UnitCard>
          <div>Position: {muster()[0]}</div>
          <div>Type: {muster()[1]?.type}</div>
          <div>Troops: <span>{Math.round(muster()[1]?.total)}</span></div>
        </UnitCard>
      </div>
    </div>
  );
}
