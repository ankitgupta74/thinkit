export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <p>banner</p>
      <p>navbar</p>

      <main>
        {children}
      </main>

      <p>footer</p>
      <p>cart sidebar</p>
    </>
  );
}