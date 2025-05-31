import Navbar from './components/Utilies/Navbar';
import Footer from './components/Utilies/Footer';
import Hero from './components/Home/Hero';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-1">
        <Hero/>
      </main>
      <Footer/>
    </div>
  );
}