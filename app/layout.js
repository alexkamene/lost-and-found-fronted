import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

// Load Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Zetech Lost & Found",
  description: "Find what you've lost, return what you've found",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
