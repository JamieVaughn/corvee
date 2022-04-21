import { createSignal } from "solid-js";
import "./tooltip.css";

export const Tooltip = (props) => {
  let timeout;
  const [active, setActive] = createSignal(false);
  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 100);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      class={`Tooltip-Wrapper ${props.class}`}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {props.children}
      <Show when={active()} fallback={null}>
        <div class={`Tooltip-Tip ${props.direction || "bottom"}`}>
          <For each={props.content}>
            { i => <div class="active tip-list">{i}</div>}
          </For>
        </div>
      </Show>
    </div>
  );
}
