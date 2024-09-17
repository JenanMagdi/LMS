import AddButton from "../components/AddClassComponents/AddButton";
import CreateClass from "../components/AddClassComponents/CreateClass";
import JoinClass from '../components/AddClassComponents/JoinClass';
import ClassCard from '../components/ClassCard';
import { CustomUseContext } from "../context/context";

const Home = () => {
  const { loggedInUser } = CustomUseContext();
  const isStaff = loggedInUser && loggedInUser.email.endsWith('@uob.edu.ly');

  return (
    <div >
      <div>
        <AddButton />
      </div>
      <div className='flex flex-wrap gap-3'>
        {isStaff && <CreateClass />}
        <JoinClass />
      </div>
      <ClassCard />
    </div>
  );
};

export default Home;
