export const Header = () => {
  return (
    <nav className="border-1 border-b-amber-600">
      <ul className="flex">
        <li className="my-2 mx-3">
          <a href="/game">Game</a>
        </li>
        <li className="my-2 mx-3">
          <a href="/playground">Playground</a>
        </li>
        <li className="my-2 mx-3">
          <a href="/api-test">API Test</a>
        </li>
      </ul>
    </nav>
  );
};
