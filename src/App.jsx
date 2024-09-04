
import NavBar from './components/navbar';
import SideBar from './components/sidebar';
import Router from './Router/Router';

function App() {
  return (
    <div className=" font-roboto bg-gray-50 ">          
    <NavBar/>
      <div className="flex ">
      <div className=" "><SideBar /></div> 
      <div className=" flex-1 m-8 "><Router /></div> 
      </div>   
    </div>
  );
}

export default App;