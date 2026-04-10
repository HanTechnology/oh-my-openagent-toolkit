---
name: data-ml-platform
description: Deliver data and ML systems across pipelines, training, evaluation, model-serving, and accelerator-aware workloads while keeping reproducibility, latency, and artifact contracts explicit.
---

# Data ML Platform

Use this pack for data and ML platform work: model training, evaluation, batch or streaming data pipelines, inference services, video or media analysis, GPU or accelerator paths, and performance-sensitive data processing.

This is the general data and ML family pack for the repo. Use the overlay in `reference/pytorch-tensorflow-sklearn-r.md` to tune decisions for PyTorch, TensorFlow, scikit-learn, and R while keeping the same expectations for data lineage, model quality, reproducibility, model-serving, and hardware awareness.

## Core focus

- Design data pipeline stages, preprocessing, feature engineering, and handoff contracts so lineage and assumptions stay visible.
- Keep training objectives, evaluation metrics, validation splits, and regression checks explicit instead of burying them in notebooks or one-off scripts.
- Treat serialization and model-serving as contracts: artifacts, schemas, preprocessing, postprocessing, and latency budgets must stay aligned.
- Plan for GPU or accelerator usage, batch sizing, memory limits, and device placement as measured resource decisions.
- Support video, media, and other high-throughput workloads with clear pipeline stages, backpressure, and observability.

## Shared data and ML standards

- Separate training, evaluation, and inference paths even when they share libraries or model code.
- Version datasets, features, model artifacts, and runtime dependencies so results can be reproduced.
- Keep online inference behavior readable, including batching, caching, fallback logic, and hardware selection.
- Make experiment tracking, benchmark baselines, and failure thresholds explicit before tuning for speed or accuracy.
- Promote notebook or exploratory work only after preprocessing, feature, and artifact contracts are encoded in maintainable code.

## Default workflow

1. Inspect the data sources, feature flow, model artifacts, serving path, and available hardware.
2. Choose the framework overlay in `reference/pytorch-tensorflow-sklearn-r.md`.
3. Define metrics, reproducibility rules, serialization format, and inference constraints before broad implementation.
4. Implement pipeline code, training or evaluation logic, and serving or scoring behavior together so offline and online paths stay aligned.
5. Run `review-work` after substantial data, model, or accelerator-related changes.

## Collaboration in this repo

- Use `Explore` before editing so new work matches local pipeline, artifact, and deployment patterns.
- Use `Librarian` or `Context7` when framework APIs, serving formats, or accelerator tradeoffs need a source-of-truth check.
- Use `review-work` when model quality, data lineage, GPU usage, or production inference behavior changes materially.

## Overlays

- `reference/pytorch-tensorflow-sklearn-r.md` for framework-specific choices around training, evaluation, serialization, inference, and reproducibility.

## Guardrails

- Do not hide preprocessing, feature logic, or postprocessing outside the model contract that serves real traffic or scheduled scoring.
- Do not assume GPU use, mixed precision, or batching improves the end-to-end path without measurement.
- Do not treat exploratory notebook output as production-ready until artifacts, dependencies, and evaluation rules are reproducible.
