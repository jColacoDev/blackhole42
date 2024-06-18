import "./globals.css";
import Footer from "@/components/footer/Footer";
import Nav from "@/components/nav/Nav";
import { UserProvider } from "@/providers/UserContext";

export const metadata = {
  title: "42hub",
  description: "A webapp developed for 42 stuff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <UserProvider>
          <div className="layout">
            <Nav />
            <main>
              {children}
            </main>
          </div>
          {/* <Footer /> */}
        </UserProvider>
      </body>
    </html>
  );
}
