import TokenSearch from "@/components/header/search";
import { Connect } from "@/components/header/connect";
import { Nav } from "./nav";

export default function Header() {
  return (
    <header className="fixed flex flex-row items-center justify-center top-0 left-0 right-0 py-2 supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur z-20">
      <Nav/>
      <TokenSearch/>
      <Connect/>
    </header>
  )
}