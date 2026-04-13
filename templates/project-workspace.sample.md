# Project Workspace Sample

這份範本示範新專案安裝 Wayground 題庫流程後，專案工作區應如何放置教材、題庫、審稿結果與發布紀錄。

請把 `<learning-scope>`、`<exam-stage>`、`<subject>`、`<bank-name>` 改成實際專案名稱。

## 建議資料夾

```text
<learning-scope>/<exam-stage>/<subject>/question-bank/
  project.config.md
  docs/
    references/
      textbooks/
      teacher-guides/
      scope/
      exams/
      curriculum/
    workflow/
      prompts/
        subjects/
        review/
  automation/
    question-banks/
    output/
      gemini-reviews/
      claude-reviews/
  wayground/
```

## 參考資料

教材、教師手冊、範圍公告、歷屆試題與課綱資料放在：

```text
docs/references/textbooks/
docs/references/teacher-guides/
docs/references/scope/
docs/references/exams/
docs/references/curriculum/
```

這些資料是命題依據，不應混進通用 workflow module。

## 題庫

本地 Markdown 題庫放在：

```text
automation/question-banks/<bank-name>.md
```

題庫進 Wayground 前至少應包含：

- 題目與選項。
- 正確答案。
- 難度標記。
- Bloom 指標。
- 必要時的解析或命題依據。

## 審題紀錄

本地初審、誘答自審、Gemini review、Claude final review 放在：

```text
automation/output/<bank-name>-local-review.md
automation/output/<bank-name>-distractor-review.md
automation/output/gemini-reviews/<bank-name>-gemini-review.md
automation/output/claude-reviews/<bank-name>-claude-final-review.md
```

若審題平台只方便輸出 `.txt`，可以保留在本機，但進 git 前要依專案規則確認是否應追蹤。

## Wayground 發布紀錄

Wayground 匯入、檢查、發布與連結紀錄放在：

```text
wayground/<bank-name>-import-run/
wayground/<bank-name>-publish.json
wayground/<bank-name>-links.json
```

正式 quiz id 與分享連結屬於 project workspace，不應寫進通用 workflow module。

## 回寫專案頁面

若專案有入口網頁，發布後再把連結回寫到該專案自己的頁面，例如：

```text
<learning-scope>/<exam-stage>/<subject>/review.html
```

回寫前請確認：

- 連結指向最新發布版本。
- 題組標題與章節範圍一致。
- 若有多版本測試題庫，頁面只放正式驗收通過的版本。

## Git 追蹤建議

建議追蹤：

- `project.config.md`
- 教材摘要與範圍整理的 Markdown
- 本地題庫 Markdown
- 本地審題報告 Markdown
- 最終 Wayground links JSON
- 專案頁面更新

建議忽略或謹慎追蹤：

- 截圖與大型二進位檔
- 單次瀏覽器操作 output
- 下載原始 PDF
- `.env` 與帳號相關設定
