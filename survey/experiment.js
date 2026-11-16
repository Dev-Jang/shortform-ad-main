/* ============================================================
   숏폼 광고 설문 — v7.4 (2026-11-16) · GitHub Pages + DataPipe 배포본
   - index.html이 이 파일(experiment.js)을 불러옵니다. 배포 전 CONFIG만 확인하세요.

   v7.0 변경 사항 (v6.2 대비)
   ① 매개변수 교체: 지각된 신선성 → 지각된 투명성(TR1~3), 지각된 진정성 → 지각된 제작 노력(EF1~3)
   ② 숏폼 이용 문항(U1·U2)을 영상 시청 전으로 이동(공변량)
   ③ (v7.2에서 삭제) 심리적 반발 3문항
   ④ 지불 의사 금액: 새 규격 + 상품 사진 제시, 네 제품 공통 금액 구간
   ⑤ 새 광고 영상 4편(media/ 폴더), 상품 사진 4장
   ⑥ 배포: Cognition.run → GitHub Pages, 저장: DataPipe 확장(extension-pipe, 문항별 전송 + 종료 시 최종 저장 → Google Drive),
      집단 배정: DataPipe 순번 → 블록 배정표
   ⑦ 사은품 버전: 동의 화면 안내 + 마지막 화면 휴대폰 번호 입력(CONFIG.REWARD.ON)

   v7.2 변경 사항 (2026-11-16)
   ① 심리적 반발(RX1~3), AI 사용 동기 추측(MA1~3) 문항·페이지 삭제
   ② SPH 삭제 → AI 제작 인식(AI_PERCEPTION_1·2, 비표시 집단, 광고별 1문항, 시청 순서대로, 역산 없음)
   ③ 분석 계획: AI 태도(G)·신기술 수용 성향(T)·AI 리터러시(L)는 수집하되 주 분석의 필수 공변량에 넣지 않음.
      세 변수를 추가한 보조 분석을 사전에 계획해 실시하며, 광고 시청 후 측정한 값이라는 해석상의 한계를 명시함.

   v7.3 변경 사항 (2026-11-16)
   ① 광고 가치 V1·V2와 안내문 수정(가치 있다 / 유용하다 / 중요하다)
   ② AI 태도: Novotny 등(2025) 일반 AI 태도 6문항(G1~6), 원척도의 질문형·응답 형식
   ③ 신기술 수용 성향: Agarwal & Prasad(1998) PIIT 4문항(T1~4, T2 역문항) — 논문 개념명 '개인적 정보기술 혁신성'
   ④ AI 리터러시: Wang 등(2023) AILS 12문항(L1~12, L2·L5·L11 역문항)
   ⑤ 새 광고 영상 4편(문구 위치 수정본)
   ※ 리커트 응답은 response에 0~6, scores에 1~7로 저장한다. 분석에는 scores를 사용하며, T2·L2·L5·L11만 8−점수로 역채점한다.

   v7.4 변경 사항 (2026-11-16)
   ① 지불 의사 금액 페이지에서 [앞 문항 수정] 버튼 제거
   ② AI 리터러시 안내문에 평가·책임 있는 사용 포함
   ③ 배정 순번을 못 받으면 단순 무작위로 넘어가지 않고 [다시 시도] 화면 표시(순번 요청 횟수는 condition_tries)
   ④ 연구자 확인용 링크(key + cell)는 배정 순번을 받지 않음
   ※ 분석 규칙: 리커트는 scores 열(1~7) 사용(response 열은 0~6). T2·L2·L5·L11만 8 − scores로 역채점.
      [앞 문항 수정]으로 같은 페이지가 여러 행 저장되면 참가자 × product × block별로 nav가 back이 아닌 마지막 행을 사용.
   ============================================================ */

(async function main() {

/* ========================== 스타일 자동 주입 ========================== */
(function () {
  var s = document.createElement("style");
  s.textContent = `
:root {
  --p: #00338D; --p2: #1a4fb5; --p-soft: #e8eefc;
  --ink: #1f2937; --mut: #6b7280; --line: #dfe3ea;
  --bg: #f2f4f8; --card: #ffffff; --r: 12px;
}
html, body { overflow-x: hidden; }
body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif;
       background: var(--bg) !important; color: var(--ink); font-size: 16px; }
.jspsych-display-element { background: var(--bg); }
/* 구글폼과 동일한 640px 고정 폭: 페이지 내용량과 무관하게 항상 같은 너비 */
.jspsych-content-wrapper { width: 100% !important; }
.jspsych-content { width: 100% !important; max-width: 672px !important; padding: 22px 16px 56px;
  box-sizing: border-box; margin: 0 auto !important; }
.jspsych-content > * { max-width: 100%; }

/* ---------- 진행바 ---------- */
#jspsych-progressbar-container { background: #fff; border-bottom: 1px solid var(--line);
  color: var(--mut); font-size: 13px; padding: 8px 0; }
#jspsych-progressbar-outer { background: #e5e8ef; border-radius: 999px; height: 8px; }
#jspsych-progressbar-inner { background: var(--p); border-radius: 999px; }

/* ---------- 카드 공통 ---------- */
.qcard, .hcard, .jspsych-survey-multi-choice-question {
  background: var(--card); border: 1px solid var(--line); border-radius: var(--r);
  padding: 20px 22px; margin: 0 0 14px; text-align: left;
  box-shadow: 0 1px 3px rgba(16,24,40,.05);
}
.hcard { padding: 26px 26px 22px; font-size: 16px; line-height: 1.8; }
.hcard h2, .hcard h3 { margin: 0 0 14px; color: var(--p); font-size: 22px; text-align: left; }
.hcard p { margin: 0 0 10px; }
.sub { color: var(--mut); font-size: 13.5px; line-height: 1.6; }
.endmsg { font-size: 17px; line-height: 1.8; margin-top: 60px; }

/* ---------- 종료 화면 (제출 완료 · 자격 미달) ---------- */
.done-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--bg); padding: 32px 16px; box-sizing: border-box;
  font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif; }
.done-card { width: 100%; max-width: 440px; background: var(--card); border: 1px solid var(--line);
  border-radius: 16px; padding: 44px 32px 36px; text-align: center; box-sizing: border-box;
  box-shadow: 0 6px 24px rgba(16,24,40,.07); }
.done-ic { width: 76px; height: 76px; border-radius: 50%; margin: 0 auto 22px;
  display: flex; align-items: center; justify-content: center; }
.done-ic.ok { background: #e6f4ec; }
.done-ic.ok svg { width: 38px; height: 38px; stroke: #1B7A43; }
.done-ic.info { background: var(--p-soft); }
.done-ic.info svg { width: 38px; height: 38px; stroke: var(--p); }
.done-ic svg { fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.done-title { font-size: 22px; font-weight: 700; color: var(--ink); margin: 0 0 12px; letter-spacing: -.2px; }
.done-body { font-size: 16px; line-height: 1.75; color: var(--ink); margin: 0; }
.done-body b { color: var(--p); }
.done-div { height: 1px; background: var(--line); margin: 26px 0 20px; }
.done-sub { font-size: 13.5px; line-height: 1.7; color: var(--mut); margin: 0; }
@media (max-width: 480px) {
  .done-card { padding: 36px 22px 30px; }
  .done-title { font-size: 20px; }
  .done-body { font-size: 15.5px; }
}

/* ---------- 페이지 상단 안내 (측정 변수 명시) ---------- */
.pg-h { background: var(--card); border: 1px solid var(--line); border-top: 6px solid var(--p);
  border-radius: var(--r); padding: 18px 22px 16px; margin: 0 0 16px; text-align: left;
  box-shadow: 0 1px 3px rgba(16,24,40,.05); }
.pg-var { display: inline-block; font-size: 13.5px; font-weight: 700; color: var(--p);
  background: var(--p-soft); padding: 5px 13px; border-radius: 999px; margin-bottom: 10px;
  letter-spacing: .2px; }
.pg-desc { font-size: 16px; line-height: 1.65; font-weight: 500; }
.pg-desc .sub { display: block; margin-top: 8px; font-weight: 400; }
#jspsych-survey-likert-preamble, #jspsych-survey-multi-choice-preamble,
#jspsych-survey-html-form-preamble { padding: 0; margin: 0; }

/* ---------- 문항 번호 ---------- */
.qn { display: inline-block; color: var(--p); font-weight: 700; margin-right: 7px; }

/* ---------- 리커트 ---------- */
#jspsych-survey-likert-form { text-align: left; }
.jspsych-survey-likert-statement { display: block !important; font-size: 16px; font-weight: 500;
  line-height: 1.55; margin: 0 0 16px !important; padding: 0 !important; color: var(--ink); }
.jspsych-survey-likert-opts { display: flex !important; flex-wrap: nowrap; justify-content: space-between;
  list-style: none; width: 100% !important; margin: 0 !important; padding: 0 !important;
  box-sizing: border-box; position: relative; }
/* 1~7 원형을 잇는 선: 첫 원 중심(1/14) ~ 마지막 원 중심(13/14) */
.jspsych-survey-likert-opts::before { content: '' !important; position: absolute !important;
  top: 11px !important; left: 7.142857%; right: 7.142857%; width: auto !important; height: 2px !important;
  background: #cfd6e1 !important; display: block !important; margin: 0 !important; z-index: 0; }
.jspsych-survey-likert-opts li { flex: 1 1 0; min-width: 0; margin: 0; text-align: center;
  display: block !important; position: relative; z-index: 1; }
.jspsych-survey-likert-opt-label { display: block; font-size: 14px; line-height: 1.35;
  color: var(--ink); cursor: pointer; padding: 0; font-weight: 500; }
/* 플러그인이 trial마다 주입하는 left:50%/margin-left:-6px 를 무력화하고 정중앙 정렬 */
.jspsych-survey-likert-opts li label input[type='radio'] {
  appearance: none !important; -webkit-appearance: none !important;
  display: block !important; position: static !important; left: auto !important; top: auto !important;
  width: 24px !important; height: 24px !important; margin: 0 auto 9px !important;
  border: 2px solid #b4bdcc; border-radius: 50%; background: #fff; box-sizing: border-box;
  cursor: pointer; transition: border .12s; }
.jspsych-survey-likert-opts li label input[type='radio']:hover { border-color: var(--p2); }
.jspsych-survey-likert-opts li label input[type='radio']:checked { border: 8px solid var(--p); }
.anch { display: block; font-size: 12.5px; color: var(--mut); font-weight: 400; line-height: 1.3; margin-top: 2px; }

/* 제품 관여도 양극 척도: 왼쪽 기준 ↔ 오른쪽 기준 */
.bip-row { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0;
  width: 100%; font-weight: 600; margin-top: 6px; }
.bip-row .bip-l, .bip-row .bip-r { white-space: nowrap; }
.qn-line { display: block; margin-bottom: 2px; }
/* 양방향 화살표(CSS로 그림: 글꼴과 무관하게 같은 길이) */
.bip-row .bip-c { display: block; padding: 0 16px; min-width: 40px; }   /* 양 끝 표현과의 여백 */
.bip-arrow { display: block; position: relative; width: 100%; height: 2px; background: #8a93a3; }
.bip-arrow::before, .bip-arrow::after { content: ''; position: absolute; top: 50%; transform: translateY(-50%);
  border-style: solid; }
.bip-arrow::before { left: -2px; border-width: 5px 8px 5px 0; border-color: transparent #8a93a3 transparent transparent; }
.bip-arrow::after  { right: -2px; border-width: 5px 0 5px 8px; border-color: transparent transparent transparent #8a93a3; }
.pid-box { display: inline-block; margin: 4px 0 14px; padding: 9px 16px; border-radius: 8px;
  background: var(--p-soft); color: var(--p); font-size: 15px; letter-spacing: .5px; user-select: all; }
span.required { display: none; }
.bip-row .bip-l { text-align: left; }
.bip-row .bip-c { color: var(--mut); font-weight: 400; flex: 0 0 auto; }
.bip-row .bip-r { text-align: right; }

/* ---------- 객관식 ---------- */
#jspsych-survey-multi-choice-form { text-align: left; }
p.jspsych-survey-multi-choice-text { font-size: 16px; font-weight: 500; line-height: 1.55;
  margin: 0 0 12px; color: var(--ink); }
.jspsych-survey-multi-choice-option { margin: 0; }
.jspsych-survey-multi-choice-option label { display: flex; align-items: center; gap: 11px;
  padding: 10px 10px; border-radius: 8px; font-size: 15px; cursor: pointer; }
.jspsych-survey-multi-choice-option label:hover { background: #f5f7fb; }
.jspsych-survey-multi-choice-option input[type='radio'], .rr-w input[type='radio'] {
  appearance: none; -webkit-appearance: none; width: 22px; height: 22px; margin: 0; flex: 0 0 auto;
  border: 2px solid #b4bdcc; border-radius: 50%; background: #fff; box-sizing: border-box; cursor: pointer; }
.jspsych-survey-multi-choice-option input[type='radio']:checked, .rr-w input[type='radio']:checked {
  border: 7px solid var(--p); }
.jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option {
  display: inline-block; margin-right: 4px; }

/* ---------- 폼(HTML) ---------- */
.formwrap { text-align: left; font-size: 15px; }
.fq { font-size: 16px; font-weight: 500; line-height: 1.55; margin: 0 0 12px; color: var(--ink); }
.formwrap input[type='number'], .formwrap select {
  font-size: 15px; padding: 9px 12px; border: 1px solid var(--line); border-radius: 8px;
  background: #fff; font-family: inherit; }
.formwrap select { min-width: 200px; }
.rr-w { display: inline-flex; align-items: center; gap: 8px; margin: 4px 22px 4px 0;
  font-weight: 400; font-size: 15px; cursor: pointer; }
.unit { margin-left: 8px; color: var(--mut); }

/* ---------- 상품 사진(지불 의사 금액) ---------- */
.wtp-fig { background: var(--card); border: 1px solid var(--line); border-radius: var(--r);
  padding: 14px; margin: 0 0 14px; text-align: center; box-shadow: 0 1px 3px rgba(16,24,40,.05); }
.wtp-fig img { display: block; width: 100%; max-width: 380px; height: auto; margin: 0 auto; border-radius: 8px; }
.wtp-fig figcaption { margin-top: 10px; font-size: 14.5px; font-weight: 600; color: var(--ink); }
.gift { background: var(--p-soft); border-radius: 10px; padding: 14px 16px; margin: 12px 0; font-size: 15px; line-height: 1.7; }
.gift b { color: var(--p); }
.phone-in { width: 210px; font-size: 16px !important; padding: 10px 12px !important; }

/* ---------- 버튼 ---------- */
.jspsych-btn, #jspsych-survey-likert-next, #jspsych-survey-multi-choice-next,
#jspsych-survey-html-form-next {
  background: var(--p) !important; color: #fff !important; border: none !important;
  border-radius: 8px !important; font-size: 15px !important; font-weight: 600;
  padding: 12px 30px !important; cursor: pointer; font-family: inherit; margin-top: 8px; }
.jspsych-btn:hover, #jspsych-survey-likert-next:hover, #jspsych-survey-multi-choice-next:hover,
#jspsych-survey-html-form-next:hover { background: var(--p2) !important; }
/* 영상 시청 중 비활성 버튼: 회색 → 시청 완료 시 네이비 */
.jspsych-btn:disabled, .jspsych-btn[disabled] { background: #c3c9d4 !important; color: #fff !important;
  cursor: not-allowed; box-shadow: none; }
.back-btn { background: #fff !important; color: var(--p) !important;
  border: 1.5px solid var(--p) !important; margin-right: 10px; }
.btn-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }

/* ---------- 영상 ---------- */
.vid-p { color: var(--mut); font-size: 13.5px; margin-top: 12px; }
.yt-ui { position: absolute; inset: 0; pointer-events: none; color: #fff;
         font-family: 'Roboto', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
         text-shadow: 0 1px 3px rgba(0,0,0,.55); z-index: 5; }
.yt-ic { width: 29px; height: 29px; fill: none; stroke: #fff;
         stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round;
         filter: drop-shadow(0 1px 2px rgba(0,0,0,.5)); }
.yt-top { position: absolute; top: 12px; right: 12px; display: flex; gap: 18px; }
.yt-top .yt-ic { width: 23px; height: 23px; }
.yt-top .yt-kb { stroke-width: 3; }
/* ★ AI 고지 라벨: 상단 좌측, 확대 */
.yt-label-top { position: absolute; top: 14px; left: 12px; right: 92px; display: flex; }
.ai-label {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,0,0,.68); color: #fff; border: 1px solid rgba(255,255,255,.45);
  font-size: 15px; line-height: 1; padding: 10px 14px; border-radius: 10px;
  letter-spacing: .2px; pointer-events: none; font-weight: 600; text-shadow: none;
  box-shadow: 0 2px 8px rgba(0,0,0,.35); white-space: nowrap;
}
.ai-label .yt-ic { width: 18px; height: 18px; stroke-width: 2.2; filter: none; }
.yt-rail { position: absolute; right: 10px; bottom: 20px; display: flex;
           flex-direction: column; align-items: center; gap: 22px; }
.yt-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.yt-btn span { font-size: 12px; font-weight: 500; }
.yt-sound { width: 30px; height: 30px; border-radius: 8px; background: #2b2b31;
            border: 1.5px solid rgba(255,255,255,.85); display: flex;
            align-items: center; justify-content: center; font-size: 14px; }
.yt-bottom { position: absolute; left: 12px; right: 68px; bottom: 16px;
             display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2; }
.yt-ch { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
.yt-av { width: 28px; height: 28px; border-radius: 50%; background: #5a5a66;
         display: inline-flex; align-items: center; justify-content: center;
         font-size: 14px; font-weight: 700; }
.yt-handle { font-size: 13.5px; font-weight: 600; }
.yt-sub { background: #fff; color: #111; font-size: 11.5px; font-weight: 700;
          padding: 5px 11px; border-radius: 15px; text-shadow: none; margin-left: 2px; }
.yt-music { font-size: 12px; opacity: .92; }
.yt-progress { position: absolute; left: 0; right: 0; bottom: 0; height: 3px;
               background: rgba(255,255,255,.28); }
.yt-fill { height: 100%; width: 0%; background: #fff; }
.tap-play { position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; background: rgba(0,0,0,.45);
  color: #fff; font-size: 44px; cursor: pointer; user-select: none; z-index: 6; }
.tap-play span { font-size: 14px; margin-top: 6px; }

/* ---------- 모바일 ---------- */
@media (max-width: 480px) {
  video { max-width: 92vw !important; max-height: 76vh !important; width: auto !important; height: auto !important; }
  .jspsych-content { padding: 14px 10px 40px; }
  .qcard, .jspsych-survey-multi-choice-question { padding: 16px 14px; }
  .pg-h { padding: 14px 16px 12px; }
  .hcard { padding: 20px 18px 16px; }
  .jspsych-survey-likert-statement, .jspsych-survey-multi-choice-text, .fq, .pg-desc { font-size: 15.5px; }
  .jspsych-survey-likert-opt-label { font-size: 13px; }
  .anch { font-size: 11.5px; }
  .jspsych-survey-likert-opts li label input[type='radio'] { width: 22px !important; height: 22px !important; }
  .jspsych-survey-likert-opts li label input[type='radio']:checked { border-width: 7px; }
  .jspsych-survey-likert-opts::before { top: 10px !important; }
  .bip-row { font-size: 14px; }
  .bip-row .bip-c { padding: 0 12px; min-width: 32px; }
  .ai-label { font-size: 14px; padding: 9px 12px; }
  .yt-sub, .yt-handle { white-space: nowrap; }
}
`;
  document.head.appendChild(s);
})();

/* ========================== [EDIT] CONFIG ========================== */
const CODE_VERSION = "7.4";
const CONFIG = {
  RUN_ENV: "pipe",               // "pipe"(DataPipe 저장) | "local"(CSV 내려받기, 시험용)
  DATAPIPE_ID: "DMiQ39uMZDXk",   // pipe.jspsych.org의 Experiment ID (shortform-ad-main)
  TASK_ID: "M1",                 // 수집 차수 구분용(경로를 바꿔 다시 배포할 때 M2, M3 …)
  VIDEO_PATH: "media/",
  REWARD: {
    ON: true,                    // true: 사은품 버전(휴대폰 번호 입력) / false: 사은품 없는 버전
    ITEM: "메가커피 아메리카노(ICE) 기프티콘"   // ★ 실제 지급할 사은품 이름으로 확인
  },
  USE_DOM_LABEL_OVERLAY: true,
  LABEL_TEXT: "AI로 생성된 영상입니다",
  VIDEO_WIDTH: 360,
  MIN_AGE: 19,                   // 만 19세 미만 자동 종료
  CONTACT: "joshuajang@hanyang.ac.kr",   // 응답 철회 문의 연락처
  DEBUG_KEY: "jy-preview"        // URL ?key=jy-preview&cell=A 일 때만 집단 강제 지정(연구자 확인용)
};

/* ---------------- 자극물 정의 ---------------- */
const PRODUCTS = {
  perfume:    { file: "perfume.mp4",    img: "wtp_perfume.jpg",    name: "향수",     cat: "hedonic",     brand: "ODMERA" },
  chocolate:  { file: "chocolate.mp4",  img: "wtp_chocolate.jpg",  name: "초콜릿",   cat: "hedonic",     brand: "MARONEL" },
  detergent:  { file: "detergent.mp4",  img: "wtp_detergent.jpg",  name: "세탁세제", cat: "utilitarian", brand: "TERVONA" },
  toothpaste: { file: "toothpaste.mp4", img: "wtp_toothpaste.jpg", name: "치약",     cat: "utilitarian", brand: "DENVELL" }
};
const CELLS = {
  A: { condition: "nolabel", category: "hedonic" },
  B: { condition: "label",   category: "hedonic" },
  C: { condition: "nolabel", category: "utilitarian" },
  D: { condition: "label",   category: "utilitarian" }
};
const WTP_SPEC = {
  perfume:    "30ml 한 병",
  chocolate:  "생초콜릿 200g(20개입) 한 상자",
  detergent:  "액체 세탁세제 2.7L 두 통",
  toothpaste: "치약 100g 네 개"
};
/* 네 제품 공통 금액 구간 */
const WTP_OPTS = ["10,000원 미만", "10,000~19,999원", "20,000~29,999원", "30,000~39,999원",
                  "40,000~49,999원", "50,000~59,999원", "60,000원 이상", "구매 의향 없음"];

/* ---------------- 내비게이션 가드 ---------------- */
let NAV_GUARD = true;
window.addEventListener("beforeunload", function (e) {
  if (!NAV_GUARD) return;
  e.preventDefault(); e.returnValue = "";
});
history.pushState({ guard: 1 }, "");
window.addEventListener("popstate", function () {
  if (!NAV_GUARD) return;
  history.pushState({ guard: 1 }, "");
  alert("브라우저 뒤로가기는 사용할 수 없습니다.\n화면 안의 [← 앞 문항 수정] 또는 [다음] 버튼으로 이동해 주세요.");
});

/* ========================== jsPsych 초기화 ========================== */
let PG = 0;                                   // 페이지 통번호(빌드 시 확정)
function page(t) { t.data = Object.assign({}, t.data || {}, { page_no: ++PG }); return t; }
/* jsPsych 8(Cognition 현행)은 progressBar.progress, 7은 setProgressBar — 둘 다 지원 */
function setProgress(p) {
  p = Math.max(0, Math.min(1, p));
  if (jsPsych.progressBar && typeof jsPsych.progressBar === "object") jsPsych.progressBar.progress = p;
  else if (typeof jsPsych.setProgressBar === "function") jsPsych.setProgressBar(p);
}
/* 종료 화면 마크업 */
function finalScreen(kind, title, bodyHTML, subHTML) {
  const icon = kind === "ok"
    ? "<svg viewBox='0 0 24 24'><path d='M5 12.5l4.5 4.5L19 7'/></svg>"
    : "<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='9'/><path d='M12 11v5M12 8h.01'/></svg>";
  return "<div class='done-wrap'><div class='done-card'>" +
         "<div class='done-ic " + kind + "'>" + icon + "</div>" +
         "<h2 class='done-title'>" + title + "</h2>" +
         "<p class='done-body'>" + bodyHTML + "</p>" +
         (subHTML ? "<div class='done-div'></div><p class='done-sub'>" + subHTML + "</p>" : "") +
         "</div></div>";
}

/* 저장 완료 화면 / 저장 실패 시 다시 시도 화면 */
function showDone() {
  document.body.innerHTML = finalScreen("ok", "제출이 완료되었습니다",
    "응답이 안전하게 저장되었습니다.<br>이제 이 창(탭)을 닫으셔도 됩니다.",
    "참여 번호 <b>" + PID + "</b> · 연구에 참여해 주셔서 진심으로 감사합니다.");
}
let SAVE_RESULT = null;                         // DataPipe 최종 저장 결과(확장 기능의 on_save가 채움)
function showSaveFail() {
  /* 최종 저장이 실패해도 문항별로 보낸 응답은 DataPipe에 남아 .partial.json으로 복구됨 */
  document.body.innerHTML = finalScreen("info", "응답 전송이 원활하지 않았습니다",
    "응답은 대부분 전송되었지만 마지막 저장을 확인하지 못했습니다.<br>아래 참여 번호를 연구자에게 알려 주시면 확인해 드리겠습니다.",
    "참여 번호 <b>" + PID + "</b> · " + CONFIG.CONTACT);
}

/* jsPsych 8은 abortExperiment, 7은 endExperiment — 8은 abort 후 on_finish가 호출되므로 메시지를 보존 */
let ABORT_MSG = null;
function endWith(msg) {
  ABORT_MSG = msg;
  if (typeof jsPsych.abortExperiment === "function") jsPsych.abortExperiment(msg);
  else jsPsych.endExperiment(msg);
}

const jsPsych = initJsPsych({
  show_progress_bar: true,
  message_progress_bar: "진행률",
  auto_update_progress_bar: false,            // ★ 되돌아가기 구역의 중첩 타임라인이 자동 계산을 왜곡하므로 수동 갱신
  extensions: [{
    type: jsPsychExtensionPipe,
    params: {
      experiment_id: CONFIG.DATAPIPE_ID,
      filename: function () { return PID + ".csv"; },
      enabled: CONFIG.RUN_ENV === "pipe",
      wait_message: "<div class='hcard'><h3>응답을 저장하는 중입니다</h3><p>잠시만 기다려 주세요. 이 창을 닫지 마세요.</p></div>",
      on_save: function (result) { SAVE_RESULT = result; }
    }
  }],
  on_trial_start: function (trial) {
    if (trial.data && trial.data.page_no) setProgress((trial.data.page_no - 1) / PG);
  },
  on_finish: function () {
    NAV_GUARD = false;
    if (ABORT_MSG) {                           // 자격 미달 종료
      document.body.innerHTML = finalScreen("info", "설문이 종료되었습니다",
        ABORT_MSG, "관심 가져 주셔서 감사합니다. 이 창(탭)을 닫으셔도 됩니다.");
      return;
    }
    if (CONFIG.RUN_ENV === "local") {
      jsPsych.data.get().localSave("csv", "main_" + PID + ".csv");
      document.body.innerHTML = finalScreen("ok", "응답 파일이 다운로드되었습니다",
        "<b>main_" + PID + ".csv</b> 파일을 연구자에게 전달해 주세요.", "참여해 주셔서 감사합니다.");
      return;
    }
    if (SAVE_RESULT && SAVE_RESULT.ok) showDone(); else showSaveFail();
  }
});

/* ---------------- 참가자 번호 · 집단 배정 ---------------- */
const urlPid = jsPsych.data.getURLVariable("pid");
const PID = urlPid ? String(urlPid) : jsPsych.randomization.randomID(8);   // 종료 화면에 표시(철회 요청용)

/* 4명 단위 블록 무작위 배정표: 블록마다 A·B·C·D 순서를 섞음.
   DataPipe가 접속 순서대로 0, 1, 2 … 순번을 주고, 그 순번으로 배정표를 읽음.
   ★ pipe.jspsych.org 실험 설정의 조건 수(Number of conditions)는 4의 배수로 가능한 한 크게 지정(예: 400).
     조건 수가 4이면 첫 블록의 순서만 반복됨(집단 크기는 같지만 순서가 고정됨). */
function hashStr(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function makeBlocks(nBlocks, seed) {
  const r = mulberry32(seed), out = [];
  for (let b = 0; b < nBlocks; b++) {
    const blk = ["A", "B", "C", "D"];
    for (let i = 3; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = blk[i]; blk[i] = blk[j]; blk[j] = t; }
    out.push.apply(out, blk);
  }
  return out;
}
const ASSIGN_SEED = hashStr("shortform-ad|" + CONFIG.TASK_ID);
const ASSIGN = makeBlocks(100, ASSIGN_SEED);             // 400칸
/* URL 집단 지정은 연구자 확인용 key가 있을 때만 허용 (본조사 링크에는 key를 붙이지 않음) */
const urlCell = (jsPsych.data.getURLVariable("key") === CONFIG.DEBUG_KEY)
  ? (jsPsych.data.getURLVariable("cell") || "").toUpperCase() : "";

/* 배정 순번 받기: 실패하면 단순 무작위로 넘어가지 않고, 설문을 시작하지 않은 채 다시 시도하게 함(블록 배정 유지).
   연구자 확인용 링크(key + cell)는 순번을 받지 않음 → 미리보기가 배정 순번을 소모하지 않음. */
let COND_RAW = null, COND_TRIES = 0;
async function fetchCondition() {
  try {
    const c = await Promise.race([jsPsychExtensionPipe.getCondition(CONFIG.DATAPIPE_ID),
                                  new Promise(function (res) { setTimeout(function () { res(null); }, 6000); })]);
    if (typeof c === "number" && Number.isFinite(c) && c >= 0) return c;
  } catch (e) {}
  return null;
}
if (CONFIG.RUN_ENV === "pipe" && !CELLS[urlCell]) {
  while (COND_RAW === null) {
    for (let k = 0; k < 3 && COND_RAW === null; k++) { COND_TRIES++; COND_RAW = await fetchCondition(); }
    if (COND_RAW !== null) break;
    await new Promise(function (resolve) {
      const box = document.createElement("div");
      box.id = "cond-retry";
      box.style.cssText = "max-width:440px;margin:18vh auto 0;padding:24px 20px;text-align:center;font-family:inherit;line-height:1.6;";
      box.innerHTML = "<h3 style='margin:0 0 10px'>접속이 원활하지 않습니다</h3>" +
        "<p style='margin:0 0 18px'>설문을 시작하지 못했습니다. 인터넷 연결을 확인한 뒤 아래 버튼을 눌러 주세요.</p>" +
        "<button type='button' class='jspsych-btn' id='cond-retry-btn'>다시 시도</button>";
      document.body.appendChild(box);
      document.getElementById("cond-retry-btn").addEventListener("click", function () { box.remove(); resolve(); });
    });
  }
}

let CELL_SOURCE;
const CELL = (function () {
  if (CELLS[urlCell]) { CELL_SOURCE = "url_debug"; return urlCell; }
  if (COND_RAW !== null && COND_RAW >= 0) {
    CELL_SOURCE = "block"; return ASSIGN[COND_RAW % ASSIGN.length];
  }
  CELL_SOURCE = "random";   // RUN_ENV가 "local"일 때만 도달
  return jsPsych.randomization.sampleWithoutReplacement(["A", "B", "C", "D"], 1)[0];
})();
const COND = CELLS[CELL].condition;
const CAT  = CELLS[CELL].category;
const productKeys = jsPsych.randomization.shuffle(
  Object.keys(PRODUCTS).filter(k => PRODUCTS[k].cat === CAT)
);
jsPsych.data.addProperties({
  pid: PID, task_id: CONFIG.TASK_ID, code_version: CODE_VERSION,
  cell: CELL, cell_source: CELL_SOURCE, condition_raw: COND_RAW, condition_tries: COND_TRIES, assign_seed: ASSIGN_SEED,
  condition: COND, category: CAT,
  product_order: productKeys.join("|"),
  reward_version: CONFIG.REWARD.ON,
  screen_w: window.screen.width, screen_h: window.screen.height,
  ua: navigator.userAgent
});

/* ========================== 공용 도우미 ========================== */
const L7 = [
  "1<br><span class='anch'>전혀<br>그렇지<br>않다</span>", "2", "3",
  "4<br><span class='anch'>보통이다</span>", "5", "6",
  "7<br><span class='anch'>매우<br>그렇다</span>"
];
const NUM7 = ["1", "2", "3", "4", "5", "6", "7"];

/* 전체 통번호 — 빌드 시점에 페이지별 시작 번호를 고정(되돌아가기에도 번호 불변) */
let QN = 0;
function takeQ(n) { const s = QN + 1; QN += n; return s; }

/* 상단 안내 생성기: 측정 변수 명시 */
function header(varName, descHTML, subHTML) {
  return "<div class='pg-h'><span class='pg-var'>" + varName + "</span>" +
         "<div class='pg-desc'>" + descHTML +
         (subHTML ? "<span class='sub'>" + subHTML + "</span>" : "") + "</div></div>";
}

/* 렌더 직후: 리커트 문항 카드 래핑 + 통번호 부여 (화면 제시 순서 기준) */
function decoratePage(qstart) {
  document.querySelectorAll(".jspsych-survey-likert-statement").forEach(function (lab) {
    if (lab.closest(".qcard")) return;
    const ul = lab.nextElementSibling;
    const card = document.createElement("div"); card.className = "qcard";
    lab.parentNode.insertBefore(card, lab);
    card.appendChild(lab); if (ul && ul.classList.contains("jspsych-survey-likert-opts")) card.appendChild(ul);
  });
  if (qstart != null) {
    let n = qstart;
    document.querySelectorAll(".jspsych-survey-likert-statement, p.jspsych-survey-multi-choice-text, .fq")
      .forEach(function (el) {
        if (el.querySelector(".qn")) return;
        if (el.querySelector(".bip-row")) {
          el.insertAdjacentHTML("afterbegin", "<span class='qn qn-line'>" + n + ".</span>");   // 번호 → 다음 줄에 양극 표현
        } else {
          el.innerHTML = "<span class='qn'>" + n + ".</span>" + el.innerHTML;
        }
        n++;
      });
  }
  /* 버튼 행 정리 */
  const form = document.querySelector(".jspsych-content form");
  if (form) {
    const submit = form.querySelector("input[type='submit'], button[type='submit']");
    if (submit && !submit.closest(".btn-row")) {
      const row = document.createElement("div"); row.className = "btn-row";
      submit.parentNode.insertBefore(row, submit); row.appendChild(submit);
    }
  }
}

function likertPage(block, extraData, varName, descHTML, items, opts) {
  opts = opts || {};
  const qstart = takeQ(items.length);
  return {
    type: jsPsychSurveyLikert,
    preamble: header(varName, descHTML, opts.sub),
    questions: items.map(function (it) {
      return { prompt: it.prompt, name: it.name, labels: it.labels || opts.labels || L7, required: true };
    }),
    randomize_question_order: opts.randomize !== false,
    button_label: "다음",
    data: Object.assign({ block: block, q_start: qstart, page_no: ++PG }, extraData || {}),
    on_load: function () { decoratePage(qstart); if (opts.on_load) opts.on_load(); },
    on_finish: function (data) {
      const s = {};
      for (const k in data.response) {
        s[k] = (typeof data.response[k] === "number") ? data.response[k] + 1 : data.response[k];
      }
      data.scores = s;
      if (opts.on_finish_extra) opts.on_finish_extra(data);
    }
  };
}

/* ---------------- 되돌아가기 구역 ---------------- */
const ANSWERS = {};
function pageKey(trial) {
  const d = trial.data || {};
  return (d.block || "") + "|" + (d.product || "") + "|" + (d.video_index || "");
}
function keepAnswers(trial) {
  const key = pageKey(trial), qs = trial.questions || null;
  const oL = trial.on_load, oF = trial.on_finish;
  trial.on_load = function () {
    if (oL) oL();
    const saved = ANSWERS[key];
    if (!saved) return;
    try {
      Object.keys(saved).forEach(function (k) {
        const val = saved[k];
        if (val === null || val === undefined || val === "") return;
        document.querySelectorAll("[name='" + k + "']").forEach(function (el) {
          if (el.type === "radio") { if (el.value === String(val)) el.checked = true; }
          else if (el.tagName === "SELECT" || el.type === "text" || el.type === "number") { el.value = val; }
        });
      });
      if (qs) {
        /* [v6.0 수정] 라디오 그룹명 끝의 숫자 = 원래 문항 인덱스.
           무작위 제시 순서에서도 올바른 문항에 복원되도록 인덱스로 매핑 */
        const groups = [];
        document.querySelectorAll("input[type='radio']").forEach(function (r) {
          if (groups.indexOf(r.name) === -1) groups.push(r.name);
        });
        groups.forEach(function (g) {
          const m = g.match(/(\d+)$/); if (!m) return;
          const q = qs[parseInt(m[1], 10)]; if (!q) return;
          const val = saved[q.name];
          if (val === null || val === undefined) return;
          const radios = document.querySelectorAll("input[type='radio'][name='" + g + "']");
          let hit = null;
          radios.forEach(function (r) { if (!hit && r.value === String(val)) hit = r; });
          if (!hit && typeof val === "string") {
            radios.forEach(function (r) {
              if (hit) return;
              const t = r.closest("label") || r.parentElement;
              if (t && t.textContent.trim() === val.trim()) hit = r;
            });
          }
          if (hit) hit.checked = true;
        });
      }
    } catch (e) {}
  };
  trial.on_finish = function (d) {
    if (d && d.response) ANSWERS[key] = d.response;
    if (oF) oF(d);
  };
  return trial;
}

let NAV_BACK = false;
function withBack(trial) {
  const oL = trial.on_load, oF = trial.on_finish;
  trial.on_load = function () {
    if (oL) oL();
    const form = document.querySelector(".jspsych-content form") || document.querySelector("form");
    if (!form) return;
    const submit = form.querySelector("input[type='submit'], button[type='submit']");
    if (!submit) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "jspsych-btn back-btn"; b.textContent = "← 앞 문항 수정";
    b.addEventListener("click", function () {
      NAV_BACK = true;
      form.querySelectorAll("[required]").forEach(function (el) { el.required = false; });
      if (typeof form.requestSubmit === "function") form.requestSubmit(submit); else submit.click();
    });
    submit.parentNode.insertBefore(b, submit);
  };
  trial.on_finish = function (d) {
    if (NAV_BACK) { d.nav = "back"; NAV_BACK = false; }
    if (oF) oF(d);
  };
  return trial;
}
function backZone(pages) {
  let i = 0;
  return {
    timeline: [{
      timeline: pages.map(function (tr, idx) {
        return { timeline: [tr], conditional_function: function () { return i === idx; } };
      }),
      loop_function: function () {
        const last = jsPsych.data.get().last(1).values()[0] || {};
        i = (last.nav === "back") ? Math.max(0, i - 1) : i + 1;
        return i < pages.length;
      }
    }]
  };
}

/* 객관식 페이지 생성기 */
function mcPage(block, extraData, varName, descHTML, questions, opts) {
  opts = opts || {};
  const qstart = takeQ(questions.length);
  return {
    type: jsPsychSurveyMultiChoice,
    preamble: header(varName, descHTML, opts.sub) + (opts.extraHTML || ""),
    questions: questions.map(function (q) { return Object.assign({ required: true }, q); }),
    button_label: "다음",
    data: Object.assign({ block: block, q_start: qstart, page_no: ++PG }, extraData || {}),
    on_load: function () { decoratePage(qstart); if (opts.on_load) opts.on_load(); },
    on_finish: opts.on_finish
  };
}

const timeline = [];

/* =====================================================================
   [블록 0] 동의 및 참여 자격
   ===================================================================== */
timeline.push(page({
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<div class='hcard'>" +
    "<h2>연구 참여 안내</h2>" +
    "<p>본 설문은 한양대학교 경영정보시스템(MIS) 석사 연구의 일부로, " +
    "<b>짧은 광고 영상에 대한 소비자 반응</b>을 알아봅니다.</p>" +
    "<p>응답은 연구 목적으로만 사용되며, 분석할 때 응답 내용으로 개인을 식별하지 않습니다. " +
    "정답은 없으니 평소 느낌대로 응답해 주세요. <b>(약 8분 소요)</b></p>" +
    (CONFIG.REWARD.ON
      ? "<div class='gift'><b>설문을 끝까지 완료하신 분께 " + CONFIG.REWARD.ITEM + "을 드립니다.</b><br>" +
        "· 마지막 화면에서 받으실 <b>휴대폰 번호</b>를 입력해 주세요. 번호는 사은품 발송에만 사용하고 발송 뒤 삭제합니다.<br>" +
        "· 사은품은 설문 수집이 끝난 뒤 한꺼번에 발송합니다.<br>" +
        "· <b>1인 1회만</b> 참여해 주세요. 중복 참여나 불성실한 응답은 발송 대상에서 제외될 수 있습니다.</div>"
      : "") +
    "<p class='sub'>※ 만 19세 이상 성인만 참여할 수 있습니다.<br>" +
    "※ 소리가 있는 영상이 재생됩니다. 소리를 켤 수 있는 환경에서 참여해 주세요.<br>" +
    "※ 아래 [다음] 버튼을 누르면 연구 참여에 동의하신 것으로 간주됩니다.</p>" +
    "</div>",
  choices: ["다음"],
  data: { block: "consent" },
  on_finish: function (d) { d.consent = true; }
}));

(function () {
  const qstart = takeQ(3);
  timeline.push(page({
    type: jsPsychSurveyHtmlForm,
    preamble: header("참여 자격 확인", "설문에 참여할 수 있는 조건인지 먼저 확인합니다."),
    html:
      "<div class='formwrap'>" +
      "<div class='qcard'><p class='fq'>만 나이를 입력해 주세요.</p>" +
      "<input type='number' name='age' min='1' max='99' required style='width:100px'><span class='unit'>세</span></div>" +
      "<div class='qcard'><p class='fq'>현재 대한민국에 거주하고 계십니까?</p>" +
      "<label class='rr-w'><input type='radio' name='kr' value='yes' required> 예</label>" +
      "<label class='rr-w'><input type='radio' name='kr' value='no'> 아니오</label></div>" +
      "<div class='qcard'><p class='fq'>지금 소리와 영상을 정상적으로 볼 수 있는 환경입니까?</p>" +
      "<label class='rr-w'><input type='radio' name='av' value='yes' required> 예</label>" +
      "<label class='rr-w'><input type='radio' name='av' value='no'> 아니오</label></div>" +
      "</div>",
    button_label: "다음",
    data: { block: "eligibility", q_start: qstart },
    on_load: function () { decoratePage(qstart); },
    on_finish: function (d) {
      const r = d.response;
      const age = Number(r.age);
      if (!Number.isFinite(age) || age < CONFIG.MIN_AGE) {
        d.eligible = false; d.inelig_reason = "age";
        endWith("본 연구는 만 " + CONFIG.MIN_AGE + "세 이상 성인을 대상으로 합니다.");
        return;
      }
      if (r.kr === "no" || r.av === "no") {
        d.eligible = false; d.inelig_reason = (r.kr === "no") ? "residence" : "av";
        endWith("참여 조건에 해당하지 않아<br>설문에 참여하실 수 없습니다.");
        return;
      }
      d.eligible = true;
    }
  }));
})();

const GATE_AT = timeline.length;              // 여기부터 아래 화면은 자격 통과자에게만 제시

/* ---------------- 시청 전 문항: 숏폼 이용(공변량) ---------------- */
timeline.push(mcPage("usage", {},
  "숏폼 이용 습관",
  "<b>숏폼 영상(유튜브 쇼츠·릴스·틱톡 등)을 평소 얼마나 자주, 오래 보는지</b> 묻습니다.",
  [
    { prompt: "일주일에 며칠 정도 숏폼 영상을 봅니까?",
      name: "U1", options: ["0일","1일","2일","3일","4일","5일","6일","7일"], horizontal: true },
    { prompt: "숏폼 영상을 하루에 평균 얼마나 봅니까?",
      name: "U2", options: ["30분 미만","30분~1시간","1~2시간","2시간 이상"] }
  ]
));

/* ---------------- 영상 사전 로딩 ---------------- */
timeline.push(page({
  type: jsPsychPreload,
  video: productKeys.map(k => CONFIG.VIDEO_PATH + PRODUCTS[k].file),
  images: productKeys.map(k => CONFIG.VIDEO_PATH + PRODUCTS[k].img),
  message: "영상을 불러오는 중입니다… (모바일은 Wi-Fi 환경을 권장합니다)",
  error_message: "영상을 불러오지 못했습니다. 새로고침 후에도 반복되면 연구자에게 알려 주세요.",
  show_progress_bar: true,
  data: { block: "preload" }
}));

/* =====================================================================
   [블록 1] 시청 안내
   ===================================================================== */
timeline.push(page({
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<div class='hcard'><h3>시청 안내</h3>" +
    "<p>지금부터 짧은 광고 영상 <b>2편</b>을 차례로 보여드립니다. " +
    "각 영상을 <b>끝까지</b> 본 뒤, 느낀 그대로 응답하시면 됩니다.</p>" +
    "<p>일부 구간에서는 <b>[← 앞 문항 수정]</b> 버튼으로 직전 페이지의 응답을 고칠 수 있습니다. " +
    "영상 시청과 확인 문항 구간은 되돌아갈 수 없습니다.</p>" +
    "<p class='sub'>영상이 끝나야 [다음] 버튼이 활성화됩니다.</p></div>",
  choices: ["영상 시청 시작"],
  data: { block: "instruction" }
}));

/* =====================================================================
   [블록 2/3] 영상 시청 + 측정
   ===================================================================== */
function videoTrial(prodKey, idx) {
  return {
    type: jsPsychVideoButtonResponse,
    stimulus: [CONFIG.VIDEO_PATH + PRODUCTS[prodKey].file],
    choices: ["다음"],
    prompt: "<p class='vid-p'>영상을 끝까지 시청해 주세요. 시청이 끝나면 [다음] 버튼이 활성화됩니다.</p>",
    width: CONFIG.VIDEO_WIDTH,
    autoplay: true,
    controls: false,
    response_allowed_while_playing: false,
    data: { block: "video", video_index: idx, product: prodKey },
    on_load: function () {
      const v = document.querySelector("video");
      if (!v) return;
      v.setAttribute("playsinline", "");
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:relative;display:inline-block;line-height:0;overflow:hidden;border-radius:14px;max-width:92vw;box-shadow:0 4px 18px rgba(0,0,0,.18);";
      v.parentNode.insertBefore(wrap, v);
      wrap.appendChild(v);

      const B = PRODUCTS[prodKey].brand;
      const S = {
        up:   ["M7 10v11", "M7 10l5.2-6.3a1.7 1.7 0 0 1 3 1.4L14.3 10h4.6a2 2 0 0 1 2 2.4l-1.3 6A3.2 3.2 0 0 1 16.5 21H7", "M7 10H3v11h4"],
        cm:   ["M4 5h16a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5H9l-5 4.5V6.5A1.5 1.5 0 0 1 4 5z"],
        sh:   ["M13.5 5.5 20 12l-6.5 6.5V14C8.5 14 5.5 16 3.5 19c.8-5 3.5-9.5 10-10.5V5.5z"],
        rmx:  ["M18.4 6.6A8 8 0 1 0 20 12", "M20 4v4h-4", "M12 9.5v5", "M9.5 12h5"],
        srch: ["M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z", "M15.5 15.5 21 21"],
        kb:   ["M12 5.6h.01", "M12 12h.01", "M12 18.4h.01"],
        info: ["M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z", "M12 11v5", "M12 8h.01"]
      };
      function svg(name, cls) {
        return "<svg viewBox='0 0 24 24' class='yt-ic " + (cls || "") + "'>" +
          S[name].map(function (p) { return "<path d='" + p + "'/>"; }).join("") + "</svg>";
      }
      const ui = document.createElement("div");
      ui.className = "yt-ui";
      ui.innerHTML =
        "<div class='yt-top'>" + svg("srch") + svg("kb", "yt-kb") + "</div>" +
        /* ★ v6.0: AI 고지 라벨을 상단 좌측에 크게 배치 (표시 조건만) */
        (COND === "label" && CONFIG.USE_DOM_LABEL_OVERLAY
          ? "<div class='yt-label-top'><div class='ai-label'>" + svg("info") + "<span>" + CONFIG.LABEL_TEXT + "</span></div></div>"
          : "") +
        "<div class='yt-rail'>" +
          "<div class='yt-btn'>" + svg("up") + "<span>2.1천</span></div>" +
          "<div class='yt-btn'>" + svg("cm") + "<span>84</span></div>" +
          "<div class='yt-btn'>" + svg("sh") + "<span>공유</span></div>" +
          "<div class='yt-btn'>" + svg("rmx") + "<span>리믹스</span></div>" +
          "<div class='yt-sound'>♪</div>" +
        "</div>" +
        "<div class='yt-bottom'>" +
          "<div class='yt-ch'><span class='yt-av'>" + B.charAt(0) + "</span>" +
          "<span class='yt-handle'>@" + B + "</span><span class='yt-sub'>구독</span></div>" +
          "<div class='yt-music'>♪ 오리지널 사운드</div>" +
        "</div>" +
        "<div class='yt-progress'><div class='yt-fill'></div></div>";
      wrap.appendChild(ui);
      const fill = ui.querySelector(".yt-fill");
      v.addEventListener("timeupdate", function () {
        if (v.duration) fill.style.width = (v.currentTime / v.duration * 100) + "%";
      });
      setTimeout(function () {
        if (v.paused) {
          const tp = document.createElement("div");
          tp.className = "tap-play";
          tp.innerHTML = "▶<br><span>탭하여 재생</span>";
          wrap.appendChild(tp);
          tp.addEventListener("click", function () { v.play(); tp.remove(); });
        }
      }, 800);
    }
  };
}

let nvFirstClick = null;

function measureBlock(prodKey, idx) {
  const nm = PRODUCTS[prodKey].name;
  const t = [];

  /* ① 지각된 투명성 — 첫 클릭 반응시간 측정 */
  t.push(likertPage("transparency", { video_index: idx, product: prodKey },
    "광고의 솔직함",
    "방금 보신 <b>" + nm + " 광고</b>가 <b>시청자를 얼마나 숨김없이 대한다고 느껴졌는지</b> 묻습니다.",
    [
      { name: "TR1", prompt: "이 광고는 시청자에게 솔직하게 알리려는 것 같다." },
      { name: "TR2", prompt: "이 광고는 시청자에게 사실을 감추지 않고 알려 주는 것 같다." },
      { name: "TR3", prompt: "이 광고는 자신에게 불리할 수 있는 사실도 시청자에게 알려 주는 것 같다." }
    ],
    {
      sub: "각 문항에 대해 1(전혀 그렇지 않다)부터 7(매우 그렇다) 중 하나를 골라 주세요.",
      on_load: function () {
        nvFirstClick = null;
        const t0 = performance.now();
        document.querySelectorAll("input[type='radio']").forEach(function (r) {
          r.addEventListener("change", function () {
            if (nvFirstClick === null) nvFirstClick = Math.round(performance.now() - t0);
          });
        });
      },
      on_finish_extra: function (d) { d.first_click_rt = nvFirstClick; }
    }
  ));

  const zonePages = [];

  /* ② 지각된 제작 노력 */
  zonePages.push(keepAnswers(likertPage("effort", { video_index: idx, product: prodKey },
    "광고 제작에 든 품",
    "방금 보신 <b>" + nm + " 광고</b>를 <b>만드는 데 품이 얼마나 들었을 것 같은지</b> 묻습니다.",
    [
      { name: "EF1", prompt: "이 광고는 많은 노력을 들여 만든 것 같다." },
      { name: "EF2", prompt: "이 광고를 만드는 데 오랜 시간이 걸렸을 것 같다." },
      { name: "EF3", prompt: "이 광고는 공을 많이 들인 광고인 것 같다." }
    ]
  )));

  /* ③ 지각된 광고 가치 (AC1 제거) */
  zonePages.push(withBack(keepAnswers(likertPage("advalue", { video_index: idx, product: prodKey },
    "광고 가치",
    "방금 보신 <b>" + nm + " 광고</b> 자체를 <b>전반적으로 어떻게 평가하는지</b> 답해 주세요.",
    [
      { name: "V1", prompt: "이 광고는 나에게 가치가 있다." },
      { name: "V2", prompt: "이 광고는 나에게 유용하다." },
      { name: "V3", prompt: "이 광고는 나에게 중요하다." }
    ]
  ))));

  /* ④ 구매 의도 */
  zonePages.push(withBack(keepAnswers(likertPage("pi", { video_index: idx, product: prodKey },
    "구매 의도",
    "광고에 나온 <b>" + nm + "</b>을(를) <b>실제로 사고 싶은 마음이 드는지</b> 묻습니다.",
    [
      { name: "P1", prompt: "나는 이 광고 속 제품을 살 것 같다." },
      { name: "P2", prompt: nm + "을(를) 고를 때, 이 광고 속 제품도 후보에 넣을 것이다." },
      { name: "P3", prompt: "나는 이 광고 속 제품을 사고 싶은 마음이 있다." }
    ],
    { sub: "내가 실제로 이 제품을 사는 상황이라고 생각하고 답해 주세요." }
  ))));

  /* ⑤ 제품 관여도 (지불 의사 금액보다 먼저) */
  zonePages.push(withBack(keepAnswers(piiPage(prodKey, idx))));

  /* ⑥ 지불 의사 금액 — 상품 사진과 규격 제시 */
  /* WTP에는 [앞 문항 수정] 버튼을 두지 않음: 상품 사진·규격·가격 구간을 본 뒤에는 앞선 광고 평가를 고칠 수 없게 함 */
  zonePages.push(keepAnswers(mcPage("wtp", { video_index: idx, product: prodKey },
    "지불 의사 금액",
    "광고에 나온 <b>" + nm + "</b>을(를) 산다면 <b>최대 얼마까지 낼 수 있는지</b> 묻습니다.",
    [{
      prompt: "이 광고 속 " + nm + "이(가) 위 사진과 같은 <b>" + WTP_SPEC[prodKey] + "</b>(이)라면, 최대 얼마까지 내고 살 수 있습니까?",
      name: "WTP", options: WTP_OPTS
    }],
    { extraHTML: "<figure class='wtp-fig'><img src='" + CONFIG.VIDEO_PATH + PRODUCTS[prodKey].img + "' alt='" + nm + " 상품 사진'>" +
                 "<figcaption>" + PRODUCTS[prodKey].brand + " " + nm + " · " + WTP_SPEC[prodKey] + "</figcaption></figure>" }
  )));

  t.push(backZone(zonePages));
  return t;
}

/* 제품 관여도 — 양극 척도(왼쪽 ↔ 오른쪽 양쪽 정렬) */
function piiPage(prodKey, which) {
  const nm = PRODUCTS[prodKey].name;
  const bip = [
    ["중요하지 않은", "중요한"], ["지루한", "흥미로운"], ["나와 관련 없는", "나와 관련 있는"],
    ["나에게 의미 없는", "나에게 의미 있는"], ["필요 없는", "필요한"]
  ];
  return likertPage("pii", { product: prodKey, product_pos: which },
    "제품 관여도",
    "이번에는 <b>광고와 상관없이</b>, 평소 <b>" + nm + "</b>(이)라는 물건이 <b>나에게 얼마나 중요하고 관심 가는지</b> 묻습니다.",
    bip.map(function (b, i) {
      return { name: "I" + (i + 1),
               prompt: "<span class='bip-row'><span class='bip-l'>" + b[0] + "</span>" +
                       "<span class='bip-c'><i class='bip-arrow'></i></span><span class='bip-r'>" + b[1] + "</span></span>",
               labels: NUM7 };
    }),
    { sub: "<b>" + nm + "</b>은(는) 나에게… 왼쪽 말에 가까우면 1, 오른쪽 말에 가까우면 7을 골라 주세요." }
  );
}

productKeys.forEach(function (pk, i) {
  timeline.push(page(videoTrial(pk, i + 1)));
  timeline.push.apply(timeline, measureBlock(pk, i + 1));
});

/* =====================================================================
   [블록 4] 사후 점검 — AI 제작 인식(비표시 전용, 광고별 1문항) → MC1
   AI 제작 인식: 점수가 높을수록 'AI로 제작했다'고 생각하는 정도가 높음.
   AI 가능성을 직접 제시하고 묻는 문항이므로 제외 기준·주 분석 통제변수로 쓰지 않고,
   비표시 집단의 인식을 설명하는 보조 자료로만 사용함.
   ===================================================================== */
if (COND === "nolabel") {
  const ORD = ["첫 번째", "두 번째"];
  const aipData = {};
  const aipItems = productKeys.map(function (pk, i) {
    aipData["ai_perception_" + (i + 1) + "_product"] = pk;
    aipData["ai_perception_" + (i + 1) + "_video_index"] = i + 1;
    return {
      name: "AI_PERCEPTION_" + (i + 1),
      prompt: ORD[i] + "로 본 <b>" + PRODUCTS[pk].brand + " " + PRODUCTS[pk].name +
              " 광고 영상</b>은 인공지능(AI)을 사용해 제작한 영상이라고 생각한다.",
      labels: L7
    };
  });
  timeline.push(likertPage("ai_perception", aipData,
    "영상 제작 방식에 대한 생각",
    "앞서 본 각 광고 영상이 어떻게 제작되었다고 생각하는지 답해 주세요.",
    aipItems,
    { randomize: false }
  ));
}

timeline.push(mcPage("mc", {},
  "표시 문구 확인",
  "방금 보신 영상에 <b>‘AI로 생성된 영상입니다’라는 표시가 있었는지</b> 기억을 묻습니다.",
  [{
    prompt: "방금 보신 <b>광고 영상 2편</b>에 <b>‘AI로 생성된 영상입니다’라는 표시</b>가 있었습니까?",
    name: "MC1", options: ["있었다", "없었다", "기억나지 않는다"]
  }]
));

/* =====================================================================
   [블록 5] 개인 특성 변수 (숏폼 이용 문항은 시청 전으로 이동)
   ===================================================================== */
/* AI 태도 — Novotny 등(2025)의 일반 AI 태도 6문항 단축척도 전체를 번안.
   원척도 형식(질문형 문항, 7점, 양 끝만 표시)을 따름. 역문항 없음. 점수 = 6문항 평균. 제시 순서 고정. */
const GAIA7 = [
  "1<br><span class='anch'>전혀<br>그렇지<br>않다</span>", "2", "3", "4", "5", "6",
  "7<br><span class='anch'>분명히<br>그렇다</span>"
];
const pgGaais = likertPage("gaais", { scale: "GAIA-6", reverse_items: "" },
  "AI에 대한 태도",
  "지금부터는 광고와 상관없이, <b>인공지능(AI)에 대한 평소 생각</b>을 묻습니다.<br>" +
  "인공지능은 일반적으로 사람의 지능이 필요한 일을 수행할 수 있습니다. 인공지능은 기계가 사람처럼 스스로 감지하고, 행동하고, 학습하고, 적응할 수 있게 합니다. " +
  "인공지능은 컴퓨터나 온라인 서비스에 들어 있을 수도 있고, 로봇과 같은 여러 기기에서 접할 수도 있습니다.",
  [
    { name: "G1", prompt: "인공지능(AI)이 세상을 더 나은 곳으로 만들 것이라고 어느 정도 생각하십니까?" },
    { name: "G2", prompt: "인공지능(AI)에 기반한 기술을 얼마나 사용하고 싶으십니까?" },
    { name: "G3", prompt: "인공지능(AI) 분야에서 앞으로 이루어질 발전을 어느 정도 기대하십니까?" },
    { name: "G4", prompt: "인공지능(AI)이 전 세계적인 문제의 해결책을 제공한다고 어느 정도 믿으십니까?" },
    { name: "G5", prompt: "인공지능(AI)을 떠올리면 주로 긍정적인 감정이 드십니까?" },
    { name: "G6", prompt: "인공지능(AI)이 적용된 기술과 적용되지 않은 기술이 있다면, 인공지능이 적용된 기술을 어느 정도 더 선택하시겠습니까?" }
  ],
  { sub: "정답은 없으니 평소 생각대로 답해 주세요.", labels: GAIA7, randomize: false }
);

/* 개인적 정보기술 혁신성(PIIT) — Agarwal & Prasad(1998) 4문항 전체를 번안.
   7점 동의 척도. T2는 역문항(분석 시 8 − 점수). 점수 = 역채점 후 4문항 평균. 제시 순서 고정. */
const pgTri = likertPage("piit", { scale: "PIIT", reverse_items: "T2" },
  "새로운 기술 사용 성향",
  "<b>새로운 정보기술(기기, 앱, 온라인 서비스 등)을 평소 어떻게 대하는 편인지</b> 묻습니다.",
  [
    { name: "T1", prompt: "새로운 정보기술에 대해 듣게 되면, 나는 그것을 직접 써 볼 방법을 찾아볼 것이다." },
    { name: "T2", prompt: "나는 대체로 새로운 정보기술을 써 보는 것을 망설인다." },
    { name: "T3", prompt: "주변 사람들 중에서 나는 보통 새로운 정보기술을 가장 먼저 써 보는 사람이다." },
    { name: "T4", prompt: "나는 새로운 정보기술을 이것저것 써 보는 것을 좋아한다." }
  ],
  { randomize: false }
);

/* AI 리터러시 — Wang, Rau, & Yuan(2023)의 AILS 12문항 전체를 번안(자기보고식).
   7점 동의 척도. 하위영역: 인식 L1~3, 사용 L4~6, 평가 L7~9, 윤리 L10~12.
   L2·L5·L11은 역문항(분석 시 8 − 점수). 제시 순서 고정, 6문항씩 두 페이지. */
const LIT_ITEMS = [
  { name: "L1",  prompt: "나는 스마트 기기와 스마트 기기가 아닌 것을 구별할 수 있다." },
  { name: "L2",  prompt: "나는 AI 기술이 나에게 어떤 도움을 줄 수 있는지 모른다." },
  { name: "L3",  prompt: "나는 내가 사용하는 앱과 제품에 적용된 AI 기술을 알아볼 수 있다." },
  { name: "L4",  prompt: "나는 AI 앱이나 제품을 능숙하게 사용해 일상적인 일에 도움을 받을 수 있다." },
  { name: "L5",  prompt: "나는 새로운 AI 앱이나 제품의 사용법을 익히는 것이 대체로 어렵다." },
  { name: "L6",  prompt: "나는 AI 앱이나 제품을 사용해 일의 효율을 높일 수 있다." },
  { name: "L7",  prompt: "나는 AI 앱이나 제품을 얼마간 사용해 본 뒤 그것의 능력과 한계를 평가할 수 있다." },
  { name: "L8",  prompt: "나는 AI가 제시하는 여러 해결 방안 중에서 적절한 것을 고를 수 있다." },
  { name: "L9",  prompt: "나는 특정한 일에 가장 알맞은 AI 앱이나 제품을 여러 가지 중에서 고를 수 있다." },
  { name: "L10", prompt: "나는 AI 앱이나 제품을 사용할 때 항상 윤리 원칙을 지킨다." },
  { name: "L11", prompt: "나는 AI 앱이나 제품을 사용할 때 개인정보와 정보 보안 문제에 전혀 주의를 기울이지 않는다." },
  { name: "L12", prompt: "나는 AI 기술의 오남용을 항상 경계한다." }
];
const LIT_DESC = "다음은 <b>AI에 대한 이해, 활용, 평가와 책임 있는 사용</b>에 관한 질문입니다. 각 문장이 평소 자신의 모습에 얼마나 해당하는지 답해 주세요.";
const pgLit1 = likertPage("lit1", { scale: "AILS", reverse_items: "L2,L5" },
  "AI 리터러시 (1/2)", LIT_DESC, LIT_ITEMS.slice(0, 6), { randomize: false });
const pgLit2 = likertPage("lit2", { scale: "AILS", reverse_items: "L11" },
  "AI 리터러시 (2/2)", LIT_DESC, LIT_ITEMS.slice(6), { randomize: false });

/* =====================================================================
   [블록 6] 인구통계
   ===================================================================== */
const pgDemo = (function () {
  const qstart = takeQ(3);
  return {
    type: jsPsychSurveyHtmlForm,
    preamble: header("기본 정보", "마지막으로 <b>통계 처리에 필요한 기본 정보</b>를 묻습니다. 응답은 통계 처리에만 사용되며, 응답 내용으로 개인을 식별하지 않습니다."),
    html:
      "<div class='formwrap'>" +
      "<div class='qcard'><p class='fq'>성별</p>" +
      "<label class='rr-w'><input type='radio' name='gender' value='남성' required> 남성</label>" +
      "<label class='rr-w'><input type='radio' name='gender' value='여성'> 여성</label>" +
      "<label class='rr-w'><input type='radio' name='gender' value='응답 안 함'> 응답 안 함</label></div>" +
      "<div class='qcard'><p class='fq'>최종 학력</p>" +
      "<select name='edu' required><option value=''>선택하세요</option>" +
      "<option>고졸 이하</option><option>대학 재학</option><option>대졸</option><option>대학원 이상</option></select></div>" +
      "<div class='qcard'><p class='fq'>월 가구 소득(세전)</p>" +
      "<select name='income' required><option value=''>선택하세요</option>" +
      "<option>300만원 미만</option><option>300~500만원</option><option>500~700만원</option>" +
      "<option>700~1,000만원</option><option>1,000만원 이상</option><option>응답 안 함</option></select></div>" +
      "</div>",
    button_label: "다음",
    data: { block: "demo", q_start: qstart, page_no: ++PG },
    on_load: function () { decoratePage(qstart); },
    on_finish: function (d) { d.measure_done = (d.nav !== "back"); }   // 앞 문항 수정으로 나간 경우는 제외
  };
})();

timeline.push(backZone([keepAnswers(pgGaais), withBack(keepAnswers(pgTri)), withBack(keepAnswers(pgLit1)), withBack(keepAnswers(pgLit2)),
                        withBack(keepAnswers(pgDemo))]));

/* =====================================================================
   [블록 7] 연구 설명 + 종료 (한 화면) — block:"end"는 완주 판정 기준이므로 유지
   ===================================================================== */
const DEBRIEF =
  "<h3>모든 문항이 끝났습니다</h3>" +
  "<p>참여해 주셔서 감사합니다.</p>" +
  "<p>본 연구의 실제 목적은 숏폼 광고에 표시되는 <b>‘AI로 생성된 영상입니다’</b> 문구가 광고 평가에 어떤 영향을 미치는지 알아보는 것이었습니다. " +
  "목적을 미리 알리면 응답이 달라질 수 있어 시작 화면에서는 일부만 안내드렸습니다.</p>" +
  "<p>모든 영상은 연구용으로 만든 <b>가상 브랜드</b>의 AI 생성 영상이며 실제 제품·브랜드와 무관합니다. " +
  "참여자에 따라 광고 제품과 문구 표시 여부를 다르게 보여 드렸습니다.</p>" +
  "<p class='sub'>응답 철회를 원하시면 아래 참여 번호를 적어 연구자 이메일(" + CONFIG.CONTACT + ")로 알려 주세요.</p>" +
  "<div class='pid-box'>참여 번호 <b>" + PID + "</b></div>";

if (CONFIG.REWARD.ON) {
  timeline.push(page({
    type: jsPsychSurveyHtmlForm,
    html:
      "<div class='hcard'>" + DEBRIEF +
      "<div class='gift'><b>" + CONFIG.REWARD.ITEM + "</b>을 받으실 휴대폰 번호를 입력해 주세요.<br>" +
      "<input type='tel' id='phone' name='phone' class='phone-in' inputmode='numeric' autocomplete='off' " +
      "placeholder='010-0000-0000' pattern='01[0-9]-?[0-9]{3,4}-?[0-9]{4}' " +
      "title='휴대폰 번호 전체를 입력하거나 비워 두세요'>" +
      "<p class='sub' style='margin:8px 0 0'>번호는 사은품 발송에만 사용하고 발송 뒤 삭제합니다. " +
      "비워 두고 제출하셔도 응답은 저장되지만 사은품은 보내 드릴 수 없습니다.</p></div>" +
      "<p>아래 버튼을 누르면 응답이 저장되며 설문이 종료됩니다.</p></div>",
    button_label: "제출 및 종료",
    data: { block: "end" },
    on_load: function () {
      const el = document.getElementById("phone"); if (!el) return;
      el.addEventListener("input", function () {
        let v = el.value.replace(/[^0-9]/g, "").slice(0, 11);
        if (v.length >= 11)      v = v.slice(0, 3) + "-" + v.slice(3, 7) + "-" + v.slice(7, 11);
        else if (v.length >= 10) v = v.slice(0, 3) + "-" + v.slice(3, 6) + "-" + v.slice(6, 10);
        else if (v.length > 3)   v = v.slice(0, 3) + "-" + v.slice(3);
        el.value = v;
      });
    },
    on_finish: function (d) {
      const raw = (d.response && d.response.phone) ? String(d.response.phone) : "";
      d.phone_digits = raw.replace(/[^0-9]/g, "");
      d.phone_given = d.phone_digits.length >= 10;
    }
  }));
} else {
  timeline.push(page({
    type: jsPsychHtmlButtonResponse,
    stimulus: "<div class='hcard'>" + DEBRIEF + "<p>아래 버튼을 누르면 응답이 저장되며 설문이 종료됩니다.</p></div>",
    choices: ["제출 및 종료"],
    data: { block: "end" }
  }));
}

/* 자격 미달 이중 차단 — abortExperiment가 실행 환경에 따라 즉시 멈추지 않더라도
   자격 확인 이후의 모든 화면(영상 로딩·시청·문항)을 건너뛰고 종료 화면으로 이동 */
const gated = timeline.splice(GATE_AT);
timeline.push({ timeline: gated, conditional_function: function () { return ABORT_MSG === null; } });

console.log("[shortform-ad] code_version " + CODE_VERSION + " / task " + CONFIG.TASK_ID + " / cell source " + CELL_SOURCE);
jsPsych.run(timeline);

})();
