import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./ui/Bar/Sidebar";
import Topbar from "./ui/Bar/Topbar";

const zona_regular = localFont({
    src: './fonts/ZonaPro-Regular.ttf',
    display: 'swap',
})

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "IDX Finance",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={zona_regular.className}>
                <Topbar />
                <Sidebar />
                {children}
            </body>
        </html>
    );
}
