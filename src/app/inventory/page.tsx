import Header from "../components/shared/Header";
import PublisherInventoryPage from "../components/publisher/publisherInventory";

export default function PublisherPage() {
  const navLinks = [
    {
      href: "/",
      label: "My Dashboard",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSddOuBOYj2EnhZUddxu45uQqqRsldSgYYn2w&s",
    }, // Link to Dashboard Page
  ];

  return (
    <>
      <Header navLinks={navLinks} />
      <main>
        <PublisherInventoryPage />
      </main>
    </>
  );
}
