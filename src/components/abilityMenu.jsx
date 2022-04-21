import { For } from 'solid-js'

// type Props = { abilities: string[], callback: () => void }
export const AbilityMenu = (props) => {

  return (
    <div>
      <For each={props.abilities}>
        {a => <div onMouseUp={() => props.callback(a)}>{a}</div>}
      </For>
    </div>
  );
}
