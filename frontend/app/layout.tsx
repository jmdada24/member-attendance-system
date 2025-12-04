import "./globals.css";

export const metadata = {
  title: "Membership System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 dark:bg-black font-sans">{children}</body>
    </html>
  );
}
