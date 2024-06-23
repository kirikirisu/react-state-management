// ref https://zenn.dev/yuta_ura/articles/react-context-api
import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import "./App.css";

type User = {
  id: number;
  isAdmin: boolean;
  name: string;
  email: string;
};

const initUser: User = {
  id: 1,
  isAdmin: true,
  name: "anonymous",
  email: "anonymous@anonymous.com",
};

const userContext = createContext<User>(initUser);
const setUserContext = createContext<Dispatch<SetStateAction<User>>>(
  () => undefined
);

const UserProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<User>(initUser);

  return (
    <userContext.Provider value={user}>
      <setUserContext.Provider value={setUser}>
        {children}
      </setUserContext.Provider>
    </userContext.Provider>
  );
};

const useUserValue = () => useContext(userContext);
const useUserSetValue = () => useContext(setUserContext);

function getRandomName() {
  const names = [
    "John",
    "Jane",
    "Alice",
    "Bob",
    "Charlie",
    "Dave",
    "Eve",
    "Frank",
    "Grace",
    "Hank",
  ];
  const randomIndex = Math.floor(Math.random() * names.length);

  return names[randomIndex];
}

const Button = () => {
  console.log("render ボタン");

  const setUser = useUserSetValue();

  const renameUser = useCallback(() => {
    setUser((prev) => {
      return { ...prev, name: getRandomName() };
    });
  }, [setUser]);

  return (
    <div>
      <button onClick={renameUser}>+1</button>
    </div>
  );
};

const DisplayUserName = () => {
  console.log("render user name");

  const { name } = useUserValue();

  return (
    <div>
      <p>ユーザー名: {name}</p>
      {/* <DisplayCountDepthOne /> */}
    </div>
  );
};

const DisplayUserEmail = () => {
  console.log("render user email");

  const { email } = useUserValue();

  return (
    <div>
      <p>ユーザーのメールアドレス: {email}</p>
    </div>
  );
};

/*
  DisplayUserNameではユーザー名しか参照していない、DisplayUserEmailではユーザーのemailしか参照していない
  しかし、ユーザー名を更新すると同一オブジェクトのためDisplayUserEmailも再レンダリングされる
 */
const App = () => {
  return (
    <div className="App">
      <Button />
      <DisplayUserName />
      <DisplayUserEmail />
    </div>
  );
};

const Root = () => {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
};

export default Root;
