import "./globals.css";
import "./globals.scss";
import Footer from "@/components/footer/Footer";
import Nav from "@/components/nav/Nav";
import ProjectsProvider from "@/providers/ProjectsContext";
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
        <ProjectsProvider>
          <div className="layout">
            <Nav />
            <main>
              {children}
            </main>
          </div>
          {/* <Footer /> */}
        </ProjectsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
