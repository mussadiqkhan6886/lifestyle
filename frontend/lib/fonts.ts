import {Roboto } from "next/font/google"
import localFont from "next/font/local";

export const roboto = Roboto({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    style: ["italic", "normal"],
    subsets: ["latin"]
})


export const aire = localFont({
  src: [
    {
      path: "../public/fonts/SVN-Aire Pro Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-aire",
  display: "swap",
});