import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Nav from "@/components/nav/Nav";

export const metadata = {
  title: "BH 42",
  description: "BlackHole 42",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Nav />
          <main>
            <Header />
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
