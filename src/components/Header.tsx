export const Header = () => {
  return (
    <nav className="header-main border-1 border-b-amber-600 bg-red-300 dark:bg-red-950">
      <ul className="flex">
        <li className="my-2 mx-3">
          <a href="/">Home</a>
        </li>
        <li className="my-2 mx-3">
          <a href="/game">Game</a>
        </li>
        <li className="my-2 mx-3">
          <a href="/playground">Playground</a>
        </li>
        <li className="my-2 mx-3">
          <a href="/api-client">API Client</a>
        </li>
        <li className="my-2 mx-3">
          <a href="/dynamic/1">Dynamic</a>
        </li>
      </ul>
    </nav>
  );
};
