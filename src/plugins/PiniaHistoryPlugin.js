import { ref, reactive } from "vue";

export function PiniaHistoryPlugin({ pinia, app, store, options }) {
  if (!options.historyEnabled) return;

  const history = reactive([]); // store - state의 변화를 기록하기 위한 배열
  const future = reactive([]); // store - state의 변화를 기록하기 위한 배열 (redo 기능에 필요)
  const doingHistory = ref(false);

  history.push(JSON.stringify(store.$state)); // $state는 모든 state에 접근하기 위함

  store.$subscribe((mutation, state) => {
    if (!doingHistory.value) {
      history.push(JSON.stringify(state));
      future.splice(0, future.length); // redo를 하고 다시 undo를 하면 redo가 안되는 문제를 해결하기 위함
    }
  });

  return {
    // history,
    // future,
    undo: () => {
      if (history.length === 1) return; // 초기값이기 때문에 더이상 undo할 수 없음
      doingHistory.value = true;
      future.push(history.pop());
      store.$state = JSON.parse(history.at(-1));
      doingHistory.value = false;
    },
    redo: () => {
      const lastState = future.pop();
      if (!lastState) return;
      doingHistory.value = true;
      history.push(lastState);
      store.$state = JSON.parse(lastState);
      doingHistory.value = false;
    },
  };
}
