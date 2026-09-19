import { useEffect } from "react";

export default function KakaoCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") ?? undefined;
    const error = params.get("error_description") ?? params.get("error") ?? undefined;

    window.opener?.postMessage({ source: "kakao-oauth", code, error }, window.location.origin);
    window.close();
  }, []);

  return <p style={{ padding: 24, textAlign: "center" }}>카카오 로그인 처리 중...</p>;
}