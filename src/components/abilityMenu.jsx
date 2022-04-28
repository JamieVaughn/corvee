import { For } from 'solid-js'

// type Props = { abilities: string[], callback: () => void }
export const AbilityMenu = (props) => {
  // props.callback(a)
  return (
    <div>
      <For each={props.abilities}>
        {a => <div onMouseUp={() => console.log(a)}>{a}</div>}
      </For>
    </div>
  );
}
