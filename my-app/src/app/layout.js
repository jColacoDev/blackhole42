import "./globals.css";
import Footer from "@/components/footer/Footer";
import Nav from "@/components/nav/Nav";

export const metadata = {
  title: "BH 42",
  description: "BlackHole 42",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="layout">
          <Nav />
          <main>
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
