# The Breathing Watershed: continuation guide

## Authorization and current checkpoint
Noah judged both Rootwake phone studies successful. He requested the next component be planned, built and made easy for Claude to continue if usage/context runs out. Publication is implied by the established demo workflow. Work on feat/living-watershed, based on the successful ravine branch 27e681f. Preserve shared Player/mobility/Board/BoardView. Publish a separate /Rootwake/watershed/ route, preserving previous demos.

Checkpoint 1: scoped, implementation next. This file must be updated with concrete test results, deployment status, and blockers before stopping.

## Hypothesis and scope
Prove a small ecology can change a meaningful exploration route, remain interesting to observe, and respond legibly to Hulda's cultivation. Reuse the familiar ravine/root network so the only new major system is a living watershed. Hulda already knows root travel and fern communion in this study.

Two groves share spring storage. Repeating wet/dry phases affect storage, soil moisture, canopy condition and decomposition. A fine-root shortcut closes under stress and regrows after recovery; the longer deep-root route ALWAYS remains usable. Never trap an awareness already inside the shortcut: hold its passage until it exits, while showing the biological closure.

Match3 gathers sap using the original 3D board. Spend 8 sap to redirect flow toward either grove or restore balanced flow. This is a tradeoff: water given to one is unavailable to the other. Spend 24 sap once to cultivate a moss basin, catching more of the existing rainfall and storing it through dry periods. Avoid conjuring arbitrary water or rewarding clicks with immediate perfect health.

Observe controls: pause, 1x and 6x game time, two-grove condition readouts, compact causal event history. Both groves advance regardless of camera location. Match3/help/hidden tabs pause ecology; observing runs it with movement held still. No offline catch-up. Standalone save key; reload resumes the saved watershed but returns awareness to a safe known anchor.

## Design limits
Authored watershed, not planetary simulation, predation, human settlements, procedural history or combat. Stylized values must not be presented as biological realism. Equilibrium means repeatable seasonal recovery, not static meters. Cultivation improves resilience, not mandatory rescue of a perpetually failing world.

## Implementation plan
- src/watershedModel.ts: pure deterministic daily water ledger, stress/recovery, route hysteresis, events, purchases, save validation.
- src/watershed.ts: adapt ravine study orchestration; use its original movement/match3 unchanged, add ecology clock and safe closing passage.
- src/watershedWorld.ts: adapt authored scene to show changing canopy, spring water and decomposers.
- watershed.html / CSS: phone observer panel and action feedback.
- tests and browser script: long-run bounded recovery, exact water balance, intervention tradeoffs, route safety, real multi-frame board touches, observer controls, persistence and viewport layouts.
- workflow deploy-watershed.yml: all tests, isolated route publication, public revision/assets verification.

## Deployment and tools
GitHub Pages serves gh-pages, fixed by Claude. Use deploy-ravine.yml as the current reference. Source writes through GitHub connector create_tree/create_commit/update_ref if local git push has no credentials; never force branch refs. Previous worktrees contain stale local docs; this isolated root-watershed worktree is authoritative for this task. Browser setup may need @sparticuz/chromium from npm: decompress chromium.br and swiftshader.tar.br into /tmp, extract with tar --no-same-owner. Playwright is in CODEX_PRIMARY_RUNTIME_NODE_MODULES. CHROMIUM_PATH selects the executable. GitHub runners can use normal playwright install.

Do not report publication from a successful source push alone: verify public revision.json and referenced JS/CSS. Update CLAUDE.md to point here once the study is ready.
