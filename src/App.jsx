import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Router from './Router/Router';

function App() {
  return (
    <div className="font-roboto bg-gray-50">
      <NavBar />
      <div className="flex">
        <SideBar />
        <main className="flex-1 m-5">
          <Router />
        </main>
      </div>
    </div>
  );
}

export default App;
