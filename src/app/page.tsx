import Header from "./components/shared/Header";
import Dashboard from "./components/ads/Dashboard";

export default function AppHome() {
  const navLinks = [
    {
      href: "/publisher",
      label: "My Profile",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-DXFpesytRtBxTDt3pmlwFLKZAPbUkQ_CDg&s",
    }, // Link to Publisher Page
  ];

  return (
    <>
      <Header navLinks={navLinks} />
      <main>
        <Dashboard />
      </main>
    </>
  );
}
