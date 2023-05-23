function App() {
  const foo = () => {};
  function baz() {
    return true;
  }

  return (
    <>
      <div marginLeft="1"></div>
      <div marginLeft="2"></div>
    </>
  );
}

const Component = () => <div borderRadius="4">Sokers</div>;
const Component2 = () => (
  <div borderRadius="4">
    <button padding="2" background="salmon">
      click me
    </button>
  </div>
);
