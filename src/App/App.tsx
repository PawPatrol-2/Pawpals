import Navbar from '../components/ui/Navbar/Navbar'
import './App.css'
import AppRoutes from './Routes'
import Footer from '../components/footer/footer';
import Hero from '../components/ui/hero/Hero';
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import { mockAnimals } from "../data/mockAnimals";

function App() {


return (
 <>
   <Navbar />
   <AppRoutes />
   <Hero />
   <AnimalGrid animals={mockAnimals} />
   {/* <AnimalGrid animals={[]} /> */}
   <Footer />
 </>
);

};

export default App
