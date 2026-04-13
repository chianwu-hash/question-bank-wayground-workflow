#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  ./scripts/install-module.sh <target-project-root>

Installs the question-bank Wayground workflow module into a target project.
USAGE
}

if [ "$#" -ne 1 ]; then
  usage
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
module_root="$(cd "$script_dir/.." && pwd)"
target_root="$(cd "$1" && pwd)"

automation_dir="$target_root/automation"
workflow_dir="$target_root/docs/workflow"
workflow_prompts_templates_dir="$target_root/docs/workflow/prompts/templates"
templates_dir="$target_root/templates"

mkdir -p "$automation_dir/question-banks"
mkdir -p "$automation_dir/output/gemini-reviews"
mkdir -p "$automation_dir/output/claude-reviews"
mkdir -p "$target_root/docs/references/textbooks"
mkdir -p "$target_root/docs/references/teacher-guides"
mkdir -p "$target_root/docs/references/scope"
mkdir -p "$target_root/docs/references/exams"
mkdir -p "$target_root/docs/references/curriculum"
mkdir -p "$workflow_dir"
mkdir -p "$workflow_prompts_templates_dir"
mkdir -p "$templates_dir"
mkdir -p "$target_root/wayground"

cp "$module_root"/automation/*.js "$automation_dir"/
mkdir -p "$automation_dir/lib"
cp -R "$module_root"/automation/lib/. "$automation_dir/lib"/

cp "$module_root/AI_DEPLOY_PROMPT.md" "$workflow_dir"/
cp "$module_root/README.md" "$workflow_dir"/
cp "$module_root/END_TO_END_FLOW.md" "$workflow_dir"/
cp "$module_root/DEPLOYMENT_CHECKLIST.md" "$workflow_dir"/
cp "$module_root/WORKFLOW_SOP.md" "$workflow_dir"/
cp "$module_root/TEXTBOOK_TO_BANK_SOP.md" "$workflow_dir"/
cp "$module_root/DISTRACTOR_SELF_REVIEW.md" "$workflow_dir"/
cp "$module_root"/docs/*.md "$workflow_dir"/

cp -R "$module_root"/prompts/. "$workflow_prompts_templates_dir"/
cp -R "$module_root"/templates/. "$templates_dir"/

if [ ! -f "$target_root/project.config.md" ]; then
  cp "$module_root/PROJECT_CONFIG_TEMPLATE.md" "$target_root/project.config.md"
fi

cp "$module_root/PACKAGE_SCRIPTS_SNIPPET.json" "$target_root/PACKAGE_SCRIPTS_SNIPPET.question-bank-wayground.json"

cat <<EOF
Question-bank Wayground workflow module installed.
Target: $target_root
Next steps:
1. Merge scripts from PACKAGE_SCRIPTS_SNIPPET.question-bank-wayground.json into package.json.
2. Fill project.config.md.
3. Read docs/workflow/DEPLOYMENT_CHECKLIST.md.
EOF
