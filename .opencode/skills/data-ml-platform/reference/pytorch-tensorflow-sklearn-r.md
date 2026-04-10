# PyTorch, TensorFlow, scikit-learn, and R overlay for `data-ml-platform`

Use this overlay when the data or ML task is shaped by PyTorch or TensorFlow training stacks, scikit-learn tabular pipelines, or R-based statistical and modeling workflows.

## Reach for this overlay when

- the stack already uses PyTorch, TensorFlow, scikit-learn, or R,
- training and evaluation must stay aligned with production inference,
- GPU or accelerator availability affects batch sizing, precision, throughput, or serving design.

## Working rules

- Keep dataset splits, feature transforms, normalization, and label handling explicit and shared between training and inference.
- Match serialization formats to the serving path: checkpoints or ONNX, SavedModel, joblib or pickle equivalents, or R model objects plus reproducible environment locks.
- Treat evaluation as first-class with held-out data, calibration or threshold checks, and task-appropriate metrics.
- Record seeds, package versions, hardware assumptions, and GPU or accelerator settings so results can be reproduced.
- Make inference latency, batching, and postprocessing visible whether delivery is batch, API-based, scheduled, or media-driven.

## Watchouts

- Avoid shipping notebook-only preprocessing or hidden feature engineering into production inference.
- Avoid assuming GPU or mixed precision improves end-to-end latency without measuring transfer, queue, and startup costs.
- Avoid mismatching serialized artifacts and serving environments across training, evaluation, and rollout.
