# Xunmi Portfolio - AI Context

이 프로젝트는 그림작가 포트폴리오 사이트입니다. 사용자는 단순한 이미지 목록이 아니라, 작가의 분위기와 작품성이 드러나는 조용한 전시실형 포트폴리오를 원했습니다. 현재 방향은 "전시실형 갤러리 + 작가 노트형 소개"를 섞은 정적 사이트입니다.

## 현재 상태

- 프로젝트 루트: `C:\Users\user\Documents\projects\xunmi`
- 로컬 URL: `http://localhost:4173`
- 실행 명령: `npm start`
- 정적 데이터 생성 명령: `npm run build`
- 런타임: Node.js 내장 `http` 서버를 사용합니다. 별도 프레임워크나 번들러는 없습니다.
- 작품 이미지는 `artImg` 폴더에 있습니다.
- `artImg`에 이미지 파일을 추가하면 서버가 자동으로 갤러리에 반영합니다.
- GitHub Pages 배포는 `.github/workflows/pages.yml`에서 처리합니다.
- Vercel 배포용 설정은 `vercel.json`에 있습니다.

## 주요 파일

- `index.html`: 페이지 구조입니다. Hero, Artist Note, Works gallery, About/Contact, Lightbox가 있습니다.
- `styles.css`: 전체 디자인입니다. 미색 종이 배경, 넓은 여백, 조용한 전시실 느낌을 목표로 합니다.
- `script.js`: `/api/artworks`에서 작품 목록을 불러와 갤러리와 라이트박스를 렌더링합니다.
- `salon.html`, `salon.css`, `salon.js`: 어두운 전시 벽과 편집형 레이아웃을 쓰는 두 번째 포트폴리오 페이지입니다.
- `studio.html`, `studio.css`, `studio.js`: 포인터 이동, 썸네일 클릭, 이전/다음 버튼, 키보드 방향키 이벤트를 쓰는 인터랙티브 포트폴리오 페이지입니다.
- `portfolio.html`: 인라인 CSS/JS로 구성된 편집형 포트폴리오 페이지입니다. `artworks.json` 또는 `/api/artworks`를 읽어 이미지 목록을 동적으로 렌더링합니다.
- `server.js`: 정적 파일 제공 및 `artImg` 폴더를 읽어 `/api/artworks` JSON을 제공합니다.
- `scripts/generate-artworks.js`: GitHub Pages 같은 정적 호스팅에서 사용할 `artworks.json`을 생성합니다.
- `artworks.json`: `npm run build` 또는 GitHub Actions 배포 중 생성되는 정적 작품 목록입니다.
- `works.json`: 작품별 메타데이터를 선택적으로 적는 파일입니다.
- `package.json`: `npm start` 스크립트만 둔 최소 구성입니다.
- `.github/workflows/pages.yml`: `main` 브랜치 푸시마다 GitHub Pages로 자동 배포합니다.
- `vercel.json`: Vercel에서 `npm run build` 후 프로젝트 루트를 정적 사이트로 배포하도록 지정합니다.

## 디자인 방향

사이트의 핵심은 작품 이미지가 먼저 보이는 것입니다. UI는 과하게 꾸미지 않고, 작품 주변에 여백을 둬서 온라인 전시실처럼 보이게 합니다.

현재 디자인 의도:

- 첫 화면은 대표작을 크게 보여줍니다.
- 작가명과 짧은 문장만 첫 화면에 배치합니다.
- 갤러리는 masonry 느낌의 column layout입니다.
- 작품 클릭 시 라이트박스로 크게 볼 수 있습니다.
- About 영역은 작가 소개, 작업 문장, 연락처를 나중에 확장하기 위한 자리입니다.
- 추가 페이지 `salon.html`은 더 강한 편집/전시 벽 분위기를 제공합니다.
- 추가 페이지 `studio.html`은 HTML 이벤트와 DOM 업데이트가 드러나는 인터랙티브 실험 페이지입니다.
- 추가 페이지 `portfolio.html`은 따뜻한 종이 질감과 매거진식 hero/gallery 구성을 제공합니다.

프론트엔드 수정 시 주의할 점:

- 카드형 UI를 과하게 늘리지 말고, 여백과 이미지 중심 구성을 유지합니다.
- 작가 사이트이므로 마케팅 랜딩페이지처럼 보이지 않게 합니다.
- 텍스트는 짧고 조용하게 유지하는 편이 좋습니다.
- 모바일에서 이미지와 텍스트가 겹치지 않도록 확인합니다.

## 갤러리 확장 방식

이미지 추가:

1. 새 이미지 파일을 `artImg` 폴더에 넣습니다.
2. 서버가 자동으로 이미지 파일을 감지합니다.
3. 브라우저를 새로고침하면 갤러리에 표시됩니다.

지원 확장자:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`
- `.gif`
- `.avif`

현재 `server.js`는 파일명을 기준으로 정렬합니다. `KakaoTalk_...jpg`, `KakaoTalk_..._01.jpg` 같은 파일명은 기본 파일이 먼저 오고 `_01`, `_02`가 뒤따르도록 보정되어 있습니다.

## 작품 메타데이터

`works.json`은 선택 사항입니다. 이미지 파일이 `works.json`에 없어도 갤러리에 표시됩니다. 다만 제목, 연도, 재료, 설명, 대표작 여부를 지정하려면 아래처럼 추가합니다.

```json
{
  "file": "example.jpg",
  "title": "작품 제목",
  "year": "2026",
  "medium": "Painting",
  "note": "작품에 대한 짧은 설명입니다.",
  "featured": true
}
```

필드 설명:

- `file`: `artImg` 안의 실제 파일명과 정확히 일치해야 합니다.
- `title`: 갤러리와 라이트박스에 보이는 작품 제목입니다.
- `year`: 제작 연도입니다.
- `medium`: 재료 또는 형식입니다.
- `note`: 작품 아래와 라이트박스에 보이는 짧은 노트입니다.
- `featured`: `true`이면 첫 화면 대표작 후보가 됩니다. 여러 개가 있으면 먼저 발견된 작품이 사용됩니다.

## 서버 동작

`server.js`의 역할:

- `/` 요청 시 `index.html` 제공
- `/styles.css`, `/script.js`, `/artImg/...` 같은 정적 파일 제공
- `/api/artworks` 요청 시 `artImg` 폴더를 읽어 작품 배열 반환
- `works.json`의 메타데이터를 파일명 기준으로 병합

## 배포

이 프로젝트는 GitHub Pages와 Vercel 배포를 모두 지원할 수 있게 되어 있습니다.

### Vercel

Vercel에서 GitHub 저장소를 import하면 됩니다.

- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `.`

이 값은 `vercel.json`에도 저장되어 있습니다. Vercel이 GitHub 저장소와 연결되면 이후 `main` 브랜치에 커밋/푸시될 때마다 자동으로 다시 배포됩니다.

### GitHub Pages

GitHub Pages를 쓰는 경우 `main` 브랜치에 푸시되면 GitHub Actions가 다음 작업을 실행합니다.

1. 저장소 체크아웃
2. Node.js 설정
3. `npm run build`로 `artworks.json` 생성
4. GitHub Pages artifact 업로드
5. GitHub Pages 배포

로컬 개발에서는 `server.js`가 `/api/artworks`를 제공합니다. GitHub Pages에서는 Node 서버가 없으므로 `script.js`가 `/api/artworks` 요청 실패 후 `artworks.json`을 읽습니다.

처음 GitHub Pages를 사용할 때 저장소 Settings의 Pages source가 GitHub Actions로 되어 있어야 합니다.

API 응답 예시:

```json
{
  "works": [
    {
      "id": "KakaoTalk_20260116_184849875",
      "file": "KakaoTalk_20260116_184849875.jpg",
      "src": "/artImg/KakaoTalk_20260116_184849875.jpg",
      "title": "Work 01",
      "year": "2026",
      "medium": "Painting",
      "note": "작품 설명",
      "featured": true
    }
  ]
}
```

## 앞으로 개선하면 좋은 것

사용자가 제공하면 반영할 정보:

- 실제 작가명
- 작가 소개문
- 대표 문장 또는 artist statement
- 연락처 이메일
- 작품별 제목, 제작연도, 재료, 설명
- 대표작으로 쓸 이미지

기능 개선 후보:

- `works.json`의 `artist` 정보를 실제 화면에 자동 반영
- 작품 카테고리 또는 연도별 필터
- 작품 상세 페이지
- 전시 이력 섹션
- 이미지 썸네일 최적화
- 배포용 정적 빌드 또는 호스팅 가이드

## 작업할 때의 추천 접근

1. 먼저 `artImg`와 `works.json`의 상태를 확인합니다.
2. 시각적 변경은 `styles.css`에서 해결합니다.
3. 갤러리 데이터 구조 변경은 `server.js`와 `script.js`를 함께 확인합니다.
4. 새 기능을 넣을 때도 작품 감상을 방해하지 않는 조용한 인터페이스를 우선합니다.
5. 변경 후 `npm start`로 서버를 띄우고 `http://localhost:4173`에서 확인합니다.
