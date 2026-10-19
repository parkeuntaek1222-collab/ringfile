# 링파일 · ringfile

YouTube 공개 영상 링크를 MP3 또는 MP4로 저장하는 무료 데스크톱 베타입니다. 앱에 변환 도구가 포함되어 있으며 가입·결제·광고·변환 서버는 없습니다.

[**Mac·Windows 무료 베타 다운로드**](https://github.com/parkeuntaek1222-collab/ringfile/releases/tag/v0.2.0-beta.1) · [웹사이트](https://ringfile.xlxor.chatgpt.site/#desktop) · [오류 제보](https://github.com/parkeuntaek1222-collab/ringfile/issues)

- Mac: Apple Silicon · macOS 13.5 이상
- Windows: Windows 11 x64 대상, 현재 사용자 설치 및 무설치 ZIP 제공
- MP3 320kbps 기본, VBR·192·128kbps 선택, 제공되는 표지·곡 정보 포함
- MP4 최대 1080p, 공개 영상 최대 120분·250MiB, 중복 이름 보호·작업 취소 지원

인증서·Apple 공증을 구매하지 않은 시험판입니다. 실행 시 보안 경고나 차단이 있을 수 있습니다. 보안 설정을 낮추지 않으며 설치 범위와 알려진 문제는 릴리스 안내를 확인해 주세요. YouTube 접근 제한에 따라 일부 영상은 처리되지 않을 수 있습니다.

## 검증과 소스

Mac 실제 YouTube MP3·MP4 저장 결과와 Windows·Mac의 생성 미디어 검사 결과를 구분해 릴리스에 첨부했습니다. Windows Server 2025 x64 및 Windows 11 ARM의 x64 에뮬레이션 검사는 모든 Windows 11 x64 물리 장비 검증을 대신하지 않습니다. 브라우저 격리 속성·보안 대화상자도 자동 검사 범위 밖입니다.

릴리스의 source ZIP에는 앱 코드·테스트·미디어 도구 소스·빌드 자료가 있습니다. third-party-sources ZIP에는 공급처 소스·정확한 버전·체크섬·재빌드 안내가 들어 있습니다. 라이선스 고지는 패키지에도 포함되어 있습니다.

이 저장소는 배포·검증 채널입니다. CI는 수동 실행이며 공개 저장소의 표준 무료 Windows/macOS 실행 환경만 사용합니다. 과금되는 Actions 아티팩트 저장소·유료 실행 환경·유료 서버·결제 설정을 추가하지 않았고 설치 파일을 자동 공개하지 않습니다.
