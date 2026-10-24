# 링파일 · ringfile

YouTube 공개 영상 링크를 MP3 또는 MP4로 저장하는 무료 데스크톱 앱입니다. 변환 도구가 포함되어 있으며 가입·결제·광고·운영자 변환 서버 없이 사용합니다.

[Mac·Windows 최신 버전 다운로드](https://github.com/parkeuntaek1222-collab/ringfile/releases/latest) · [링파일 공식 사이트](https://ringfile.pages.dev/) · [사용 안내](https://ringfile.pages.dev/guide) · [앱 설치 안내](https://ringfile.pages.dev/download) · [오류 제보](https://github.com/parkeuntaek1222-collab/ringfile/issues)

- Mac: Apple Silicon · macOS 13.5 이상
- Windows: Windows 11 x64 대상, 현재 사용자 설치 및 무설치 ZIP 제공
- MP3 320kbps 기본, VBR·192·128kbps 선택, 제공되는 표지·곡 정보 포함
- MP4 최대 1080p, 공개 영상 최대 120분·250MiB, 중복 이름 보호·작업 취소 지원

**Windows 배포자 서명과 Apple Developer ID·공증은 아직 적용되지 않았습니다.** 정식 버전에서도 보안 경고나 차단이 있을 수 있습니다. 보안 설정을 낮추지 않으며 설치 범위와 알려진 문제는 릴리스 안내를 확인해 주세요. YouTube 접근 제한에 따라 일부 영상은 처리되지 않을 수 있습니다.

0.2.2부터 새 버전 알림의 **업데이트**를 한 번 누르면 파일 검증·다운로드·설치·재실행을 진행합니다. 기존 0.2.0·0.2.1은 이번 버전만 한 번 직접 설치해야 합니다. 설정과 다운로드 파일은 유지하며, 자동 설치 실패 시 이전 앱을 복원합니다. Windows ZIP 사용자는 설치판을 설치하고, Mac 앱은 디스크 이미지 밖으로 복사해 사용해 주세요.

## 검증과 소스

[0.2.2 자동 업데이트·패키지 검사](https://github.com/parkeuntaek1222-collab/ringfile/actions/runs/39609852451)가 통과했습니다. Windows 베타에서 업데이트·저장 위치 복원·UI·생성 미디어 MP3/MP4 전체 디코딩·취소·중복 이름 보호·제거 후 파일 보존과 Mac 설치·실행·미디어 변환을 검사합니다. Windows Server 2025 x64 및 Windows 11 ARM의 x64 실행 환경 검사는 모든 물리 장비와 보안 대화상자 검증을 대신하지 않습니다.

2026-10-21 사용자 Windows PC의 베타 설치·실제 다운로드 점검이 문제없다는 수동 확인을 받았습니다. 자동 검사와 구분해 릴리스에 기록했습니다. 정식 패키지의 Windows 다운로드 엔진과 미디어 도구는 점검한 베타와 바이트 단위로 동일합니다.

이 저장소는 배포·검증 채널입니다. 릴리스의 source ZIP에는 앱 코드·테스트·미디어 도구 소스·빌드 자료가, third-party-sources ZIP에는 공급처 소스·버전·체크섬·재빌드 안내가 있습니다. 라이선스 고지는 패키지에도 포함됩니다.

CI는 수동 실행이며 공개 저장소의 표준 무료 Windows/macOS 실행 환경만 사용합니다. Actions 유료 아티팩트 저장소·유료 실행 환경·유료 서버·결제 설정을 추가하지 않았으며, 검사 통과 후 설치 파일을 공개합니다.
