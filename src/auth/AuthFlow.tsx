import { useState } from "react";
import type { Provider } from "./types";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import FindIdForm from "./components/FindIdForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import MyPageInfo from "./components/MyPageInfo";
import ChangePasswordForm from "./components/ChangePasswordForm";
import "./auth.css";

type View =
  | { name: "login" }
  | {
      name: "signup";
      provider: Provider;
      prefill?: { email?: string; name?: string; idToken?: string };
    }
  | { name: "find-id" }
  | { name: "reset-password" }
  | { name: "mypage" }
  | { name: "change-password" };

interface Props {
  initialView?: View["name"];
  onAuthSuccess?: () => void;
}

export default function AuthFlow({ initialView = "login", onAuthSuccess }: Props) {
  const [view, setView] = useState<View>({ name: initialView } as View);

  switch (view.name) {
    case "login":
      return (
        <LoginForm
          onLoginSuccess={() => {
            setView({ name: "mypage" });
            onAuthSuccess?.();
          }}
          onNeedSignup={(provider, prefill) => setView({ name: "signup", provider, prefill })}
          onGoFindId={() => setView({ name: "find-id" })}
          onGoResetPassword={() => setView({ name: "reset-password" })}
        />
      );

    case "signup":
      return (
        <SignupForm
          provider={view.provider}
          prefill={view.prefill}
          onDone={() => {
            setView({ name: "mypage" });
            onAuthSuccess?.();
          }}
          onGoToLogin={() => setView({ name: "login" })}
        />
      );

    case "find-id":
      return <FindIdForm onBack={() => setView({ name: "login" })} />;

    case "reset-password":
      return (
        <ResetPasswordForm
          onBack={() => setView({ name: "login" })}
          onDone={() => setView({ name: "login" })}
        />
      );

    case "mypage":
      return <MyPageInfo onGoChangePassword={() => setView({ name: "change-password" })} />;

    case "change-password":
      return <ChangePasswordForm onBack={() => setView({ name: "mypage" })} />;
  }
}