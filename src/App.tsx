// ref: https://next-blog.croud.jp/contents/5cd634fa-497c-4867-ae64-dc8fd156fbe1
import { useCallback } from "react";
import { StoreProvider, useDispatch, useSelector } from "./store";
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

  const dispatch = useDispatch<User>();

  const renameUser = useCallback(() => {
    dispatch((prev) => {
      return { ...prev, name: getRandomName() };
    });
  }, [dispatch]);

  return (
    <div>
      <button onClick={renameUser}>Rename</button>
    </div>
  );
};

const DisplayUserName = () => {
  console.log("render user name");
  const name = useSelector((state: User) => state.name);

  return (
    <div>
      <p>ユーザー名: {name}</p>
      {/* <DisplayCountDepthOne /> */}
    </div>
  );
};

const DisplayUserEmail = () => {
  console.log("render user email");

  const email = useSelector((state: User) => state.email);

  return (
    <div>
      <p>ユーザーのメールアドレス: {email}</p>
    </div>
  );
};

/*
  DisplayUserName, DisplayUserEmailは同じオブジェクトを参照するが、
  参照しているプロパティが更新された時のみ再レンダリングする
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
    <StoreProvider initState={() => initUser}>
      <App />
    </StoreProvider>
  );
};

export default Root;
