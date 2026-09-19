import { useEffect, useState } from "react";
import { getMyInfo } from "../api";
import type { MyPageInfo as MyPageInfoT } from "../types";

interface Props {
  onGoChangePassword: () => void;
}

export default function MyPageInfo({ onGoChangePassword }: Props) {
  const [info, setInfo] = useState<MyPageInfoT | null>(null);

  useEffect(() => {
    getMyInfo().then(setInfo);
  }, []);

  if (!info) return <div className="auth-card">불러오는 중...</div>;

  return (
    <div className="auth-card">
      <h2 className="auth-title">내 정보</h2>

      <dl className="info-list">
        <div className="info-row">
          <dt>이름</dt>
          <dd>{info.name}</dd>
        </div>
        <div className="info-row">
          <dt>이메일(아이디)</dt>
          <dd>{info.email}</dd>
        </div>
        <div className="info-row">
          <dt>전화번호</dt>
          <dd>{info.phone}</dd>
        </div>
      </dl>

      <button type="button" className="btn-outline auth-submit" onClick={onGoChangePassword}>
        비밀번호 변경
      </button>
    </div>
  );
}
