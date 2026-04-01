import Navbar from '../components/ui/Navbar/Navbar'
import './App.css'
import AppRoutes from './Routes'
import Footer from '../components/footer/footer';
import Hero from '../components/ui/hero/Hero';

function App() {


return (
 <>
   <Navbar />
   <AppRoutes />
   <Hero />
   <Footer />
 </>
  )
}

export default App
