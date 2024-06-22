// ref https://zenn.dev/yuta_ura/articles/react-context-api
import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useContext,
  useState,
  memo,
} from "react";
import "./App.css";

// Context を二つに分ける
const countContext = createContext<number>(0);
const setCountContext = createContext<Dispatch<SetStateAction<number>>>(
  () => undefined
);

const CountProvider = ({ children }: { children: ReactElement }) => {
  const [count, setCount] = useState<number>(0);

  return (
    <countContext.Provider value={count}>
      <setCountContext.Provider value={setCount}>
        {children}
      </setCountContext.Provider>
    </countContext.Provider>
  );
};

const useCountValue = () => useContext(countContext);
const useCountSetValue = () => useContext(setCountContext);

const Button = () => {
  console.log("render ボタン");

  const setCount = useCountSetValue();

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, [setCount]);

  return (
    <div>
      <button onClick={increment}>+1</button>
    </div>
  );
};

const DisplayCountDepthOne = memo(() => {
  console.log("render display count depth 1");
  return <></>;
});

const DisplayCount = () => {
  console.log("render カウント");

  const count = useCountValue();

  return (
    <div>
      <p>カウント: {count}</p>
      <DisplayCountDepthOne />
    </div>
  );
};

const BindContextValueMiddleTopComponent = () => {
  console.log(
    "useContextしているコンポーネントを子コンポーネントに持つコンポーネント: BindContextValueMiddleTopComponent"
  );

  return (
    <>
      <div>BindContextValueMiddleTopComponent</div>
      <BindContextValueMiddleComponent />
    </>
  );
};

const BindContextValueMiddleComponent = () => {
  console.log(
    "useContextのバインドを持たない親コンポーネントを持つコンポーネント: BindContextValueMiddleComponent"
  );
  const count = useCountValue();

  return (
    <div>
      <p>Count: {count}</p>
      <BindContextValueMiddleChildComponent />
    </div>
  );
};

const BindContextValueMiddleChildComponent = memo(() => {
  console.log(
    "useContextのバインドをしている親コンポーネントを持つコンポーネント: BindContextValueMiddleChildComponent"
  );

  return <p>BindContextValueMiddleChildComponent</p>;
});

/* この場合、コンテキストの中間にあるコンポーネントは再レンダリングされない。
   useContextでstateをsubscribeしているコンポーネント配下のコンポーネントは全て再レンダリングされる
   つまり、useContextはできるだけリーフにあるコンポーネントで使うべき
   stateにオブジェクト使う場合、正規化は「 2 つの state 変数が常に一緒に変更される場合は、それらを単一の state 変数にまとめる」
   https://ja.react.dev/learn/choosing-the-state-structure#group-related-state
 */
const App = () => {
  return (
    <div className="App">
      <DisplayCount />
      <Button />
      <BindContextValueMiddleTopComponent />
    </div>
  );
};

const Root = () => {
  return (
    <CountProvider>
      <App />
    </CountProvider>
  );
};

export default Root;
