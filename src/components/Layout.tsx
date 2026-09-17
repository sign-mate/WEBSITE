import { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

interface Props {
  onLoginClick: () => void;
  children: ReactNode;
}

export default function Layout({ onLoginClick, children }: Props) {
  return (
    <>
      <Nav onLoginClick={onLoginClick} />
      {children}
      <Footer />
    </>
  );
}
