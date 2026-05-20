import Banner from "@/components/home/Banner";
import Navbar from "@/components/navigation/Navbar";

export default function CustomerLayout({
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

      <p>footer</p>
      <p>cart sidebar</p>
    </>
  );
}