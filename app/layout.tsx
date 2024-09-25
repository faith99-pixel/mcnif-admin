import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.scss";
import Layout from "./components/Layout";
import NextTopLoader from "nextjs-toploader";
import Providers from "./Providers";

const josefinSans = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "McNiff Restaurant",
    description: "Your favorite restaurant in the heart of the city.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${josefinSans.className} bg-mcNiff-light-gray`}>
                <NextTopLoader
                    color="#B1883D"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={3}
                    crawl={true}
                    showSpinner={true}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #B1883D,0 0 5px #B1883D"
                />
                <Providers>
                    <Layout>
                        {children}
                    </Layout>
                </Providers>
            </body>
        </html>
    );
}
