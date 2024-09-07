import AddButton from '../components/Class/AddButton';
import CreateClass from "../components/class/CreateClass";
import JoinClass from '../components/Class/JoinClass';
import JoinedClasses from '../components/Class/JoinedClasses';

const Home = () => {



  return (
    <div>
      <div>
        <AddButton />
      </div>
      <div className='flex flex-wrap gap-3'>
        <CreateClass />
        <JoinClass />
      </div>
      <JoinedClasses/>
    </div>
  );
};

export default Home;
