import { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

interface Props {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onMyPageClick: () => void;
  onLogout: () => void;
  children: ReactNode;
}

export default function Layout({ isLoggedIn, onLoginClick, onMyPageClick, onLogout, children }: Props) {
  return (
    <>
      <Nav isLoggedIn={isLoggedIn} onLoginClick={onLoginClick} onMyPageClick={onMyPageClick} onLogout={onLogout} />
      {children}
      <Footer />
    </>
  );
}
