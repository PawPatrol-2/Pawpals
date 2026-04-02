import Navbar from '../components/Navbar/Navbar'
import './App.css'
import AppRoutes from './Routes'
import Footer from '../components/footer/footer';
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import { mockAnimals } from "../data/mockAnimals";

function App() {

return (
 <>
   <Navbar />
   <AppRoutes />
   <AnimalGrid animals={mockAnimals} />
   {/* <AnimalGrid animals={[]} /> */}
   <Footer />
 </>
);

};

export default App
