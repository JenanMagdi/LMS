import NavBar from './components/navbar';
import SideBar from './components/sidebar';
import Router from './Router/Router';

function App() {
  return (
    <div className="font-roboto  bg-gradient-to-b from-blue-50 to-blue-200">
      <NavBar />
      <div className="flex">
        <SideBar />
        <main className="flex-1  ">
          <Router />
        </main>
      </div>
    </div>
  );
}

export default App;
