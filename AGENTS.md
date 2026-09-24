## No subagents, no parallel work

Never spawn subagents (the `Agent` tool, forks, etc.) and never run tool calls in
parallel in this repo. Always work sequentially, one step at a time, in the main
conversation. This is a permanent rule for this repo, regardless of task size.

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Builds: GitHub Actions only

**All builds go through GitHub Actions — nothing else.** Don't run EAS / the `eas` CLI,
and don't build locally with Gradle (`./gradlew assemble*` / `bundle*`). Both workflows
are `workflow_dispatch`-only, so trigger them with `gh`:

| Build | Workflow | Artifact |
| --- | --- | --- |
| Android debug APK (for adb testing) | `android-debug-build.yml` | `clarity-in-calm-debug-apk` |
| Android release AAB (Play Store) | `android-release-build.yml` | `clarity-in-calm-release-aab` |

```bash
gh workflow run android-release-build.yml --ref main
gh run list --workflow android-release-build.yml --limit 1   # get the run id
gh run watch <run-id>
gh run download <run-id> -n clarity-in-calm-release-aab -D release-aab/
adb install <path-to-downloaded-debug.apk>                    # debug builds only
```

- Builds run from what's **pushed** to the ref — commit and push first, or the run
  won't contain your change.
- The release workflow signs with the production keystore (secrets in the `release`
  GitHub Environment) and fails the run if the signature SHA256 doesn't match or any
  of the 4 ABIs is missing.
- versionCode isn't checked against the Play Console — check the live version there
  before dispatching a release build.
- Builds are limited. Confirm with the user before dispatching a release build.

Why not local builds: this machine (~6.4GB RAM, shared across every repo) gets Gradle
killed by the out-of-memory killer mid-compile, with no error. Why not EAS: build credits
ran out.
