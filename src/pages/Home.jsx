import AddButton from '../components/AddButton';
import { CourseCard } from '../components/CourseCard';
import CreateClass from './CreateClass';
import JoinClass from './JoinClass';

const Home = () => {
    return (
        <div  >
       <div > <AddButton/> </div>
       <div className=' flex flex-wrap gap-3 '>
       <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CreateClass/>
            <JoinClass/>
            </div>
            </div>
        );
}

export default Home;
