import NavBar from './components/navbar';
import SideBar from './components/sidebar';
import Router from './Router/Router';

function App() {
  return (
    <div className="font-roboto bg-gray-50">
      <NavBar />
      <div className="flex">
        <SideBar />
        <main className="flex-1 m-1">
          <Router />
        </main>
      </div>
    </div>
  );
}

export default App;
