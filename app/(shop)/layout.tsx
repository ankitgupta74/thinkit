import CartSidebar from "@/components/cart/CartSidebar";
import Banner from "@/components/home/Banner";
import Footer from "@/components/navigation/Footer";
import Navbar from "@/components/navigation/Navbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Banner />

      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

      <CartSidebar />
    </>
  );
}
