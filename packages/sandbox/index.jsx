import { useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const foo = () => {};
  function baz() {
    return true;
  }

  return (
    <>
      <div
        border="1px solid white"
        // padding={cx({
        //   'abc': isOpen,
        //   'xyz': true,
        //   'wfg': false
        // })}
        marginBottom="100px"
        visibility={isOpen && true && !"asd" ? "visible" : "hidden"}
        background={true ? "gray" : isOpen ? "salmon" : "white"}
        color={isOpen ? (false ? (true ? "green" : "yellow") : "red") : "blue"}
        display={isOpen ? "relative" : "block"}
      >
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
