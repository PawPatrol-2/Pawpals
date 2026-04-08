import Navbar from '../components/Navbar/Navbar'
import './App.css'
import AppRoutes from './Routes'
import Footer from '../components/footer/footer';


function App() {

return (
 <div className="appLayout">
   <Navbar />
   <main className="appContent">
    <AppRoutes />
   </main>
   <Footer />
 </div>
);

};

export default App
