import { ContentProvider } from "./context/ContentContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import About from "./components/landing/About";
import History from "./components/landing/History";
import Activities from "./components/landing/Activities";
import UpcomingEvents from "./components/landing/UpcomingEvents";
import Connect from "./components/landing/Connect";
import Gallery from "./components/landing/Gallery";
import Team from "./components/landing/Team";
import Achievements from "./components/landing/Achievements";
import Testimonials from "./components/landing/Testimonials";
import FAQ from "./components/landing/FAQ";
import Footer from "./components/landing/Footer";
import FloatingCTA from "./components/landing/FloatingCTA";
import InstallPWA from "./components/InstallPWA";

export default function App() {
  return (
    <ContentProvider>
      <div className="min-h-screen bg-paper font-th">
        <ErrorBoundary><Navbar /></ErrorBoundary>
        <ErrorBoundary><Hero /></ErrorBoundary>
        <ErrorBoundary><About /></ErrorBoundary>
        <ErrorBoundary><History /></ErrorBoundary>
        <ErrorBoundary><Activities /></ErrorBoundary>
        <ErrorBoundary><UpcomingEvents /></ErrorBoundary>
        <ErrorBoundary><Gallery /></ErrorBoundary>
        <ErrorBoundary><Team /></ErrorBoundary>
        <ErrorBoundary><Achievements /></ErrorBoundary>
        <ErrorBoundary><Testimonials /></ErrorBoundary>
        <ErrorBoundary><FAQ /></ErrorBoundary>
        <ErrorBoundary><Connect /></ErrorBoundary>
        <ErrorBoundary><Footer /></ErrorBoundary>
        <FloatingCTA />
        <InstallPWA />
      </div>
    </ContentProvider>
  );
}
