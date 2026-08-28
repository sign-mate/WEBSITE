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
  | { name: "signup"; provider: Provider; prefill?: { email?: string; name?: string; idToken?: string } }
  | { name: "find-id" }
  | { name: "reset-password" }
  | { name: "mypage" }
  | { name: "change-password" };

/**
 * 라우터에 종속되지 않는 간단한 내부 상태 기반 플로우입니다.
 * 실제 프로젝트에 라우터(react-router 등)가 있다면, 이 컴포넌트의 view state를
 * URL 기반 라우팅으로 바꿔서 각 화면을 개별 페이지/경로에 연결하세요.
 */
export default function AuthFlow({ initialView = "login" as View["name"] }) {
  const [view, setView] = useState<View>({ name: initialView } as View);

  switch (view.name) {
    case "login":
      return (
        <LoginForm
          onLoginSuccess={() => setView({ name: "mypage" })}
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
          onDone={() => setView({ name: "mypage" })}
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
