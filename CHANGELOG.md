# Changelog

## Unreleased

- Fixed Wayground Markdown import parsing so per-question metadata such as `難易度`, `難度`, `Bloom`, `依據`, separators, and trailing distribution checks are not appended to question stems.
- Added `CDP_URL` environment variable support to browser, Wayground inspect, and Gemini review/capture scripts while keeping `http://127.0.0.1:9222` as the default endpoint.
- Documented non-default CDP port usage in README, deployment checklist, and troubleshooting notes.
- Documented module boundaries for separating reusable workflow code from project-specific question-bank outputs.
- Added project workspace template for textbooks, question banks, review outputs, and Wayground publish records.
- Added Ubuntu / macOS / WSL install script alongside the Windows PowerShell installer.
- Added portability dry-run documentation.
- Added standalone repo export script and standalone `.gitignore` template.
