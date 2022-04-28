import { For } from 'solid-js'
import { units } from "../data/pieces";
import { Tooltip } from "./tooltip";
import styles from "./style.module.css";


export const TechTree = () => {
  
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
      <p class={styles.description}>
        A Cooldown-based Strategy game. Mouse over to see unit stats below:
      </p>
      <div class={styles.guide}>
        <For each={Object.values(units)}>
          {u => (
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
          )}
        </For>
      </div>
    </>
  )
}
