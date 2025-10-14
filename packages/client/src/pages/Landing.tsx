import CTA from "../components/Landing/CTA";
import Features from "../components/Landing/Features";
import Footer from "../components/Landing/Footer";
import Header from "../components/Landing/Header";
import Navbar from "../components/Landing/Navbar";

export default function Landing() {
    return (
        <>
            <Navbar />
            <Header />
            <Features />
            <CTA />
            <Footer />
        </>
    )
}