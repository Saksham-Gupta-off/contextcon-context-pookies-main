import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crusty Crab Ventures — AI-native sourcing, second-mover thesis",
  description:
    "Eugene K. is the AI GP. We shadow the thesis of a16z, YC, SPC and Founders Fund — then hunt the cheaper second mover in the same category.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
