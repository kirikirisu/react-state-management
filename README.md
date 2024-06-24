# Context + useReducer
- ステートマシンが欲しい時に使える、contextはstateとdispacherの配布、reducerは状態管理の責務
- 基本的にはこの組み合わせで状態管理ができる。[公式でもこの方法が紹介されている。](https://ja.react.dev/learn/scaling-up-with-reducer-and-context)
- reduxのコアメンテナもライブラリを使用したくない場合はこの方法を[お薦めしている。](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/#recommendations)

# Context + useReducerはパフォーマンス上の問題がある
useContextをしているコンポーネント配下のコンポーネントは値に変更があったときに全て再レンダリングされる。React.memoで一定解決できる。React19のReact Compilerで最適化される可能性も高い。
一方で、オブジェクトを参照する場合に、オブジェクトのプロパティが多いとコンポーネントで参照しているプロパティ以外が更新された時もそのコンポーネントは再レンダリングしてしまう。この問題はstate（オブジェクト）の分割により一定解決するが、分割が難しい場合はuseSyncExternalStore + useRef で解決する。
基本的にはContext + useReducer を使い、stateが大きく（オブジェクトのプロパティが多く）、参照するコンポーネントが多いstateに関してはuseSyncExternalStoreを使うのが良さそう

参考
https://zenn.dev/yuta_ura/articles/react-context-api
Contextとstateを組み合わせる場合の大きなアンチパターンが分かる
https://panda-program.com/posts/react-usecontext-usereducer
弁護士ドットコムでの活用事例
https://github.com/dai-shi/use-context-selector/issues/109#issuecomment-1785147682
useSyncExternalStore + useRef(外部の状態) で Context + useReducer のパフォーマンス問題を解決できる
https://next-blog.croud.jp/contents/5cd634fa-497c-4867-ae64-dc8fd156fbe1
これもuseSyncExternalStoreの例
Context に state を入れてしまうとどうしてもパフォーマンスの問題が出てくるため、stateではなくuseRefの値などReactから見たときに静的なデータをContextに入れる。そして、各々のコンポーネントでContextの値を監視しておいて、値が変わった時に再レンダリングをする。useSyncExternalが出る前は各々コンポーネントでuseEffectで値を監視していたが、今はuseSyncExternalStoreで監視できる
