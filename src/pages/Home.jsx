import AddButton from "../components/Classes/AddButton";
import CreateClass from "../components/Classes/CreateClass";
import JoinClass from '../components/Classes/JoinClass';
import JoinedClasses from '../components/Classes/JoinedClasses';

const Home = () => {
  return (
    <div>
      <div>
        <AddButton />
      </div>
      <div className='flex flex-wrap gap-3'>
        <CreateClass/>
        <JoinClass/>
      </div>
      <JoinedClasses/>
    </div>
  );
};

export default Home;
