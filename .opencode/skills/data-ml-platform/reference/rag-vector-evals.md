# RAG, vector stores, and evals overlay for `data-ml-platform`

Use this overlay when the data or ML task is shaped by retrieval-augmented generation, embeddings, vector indexes, hybrid search, and grounding-sensitive evaluation.

## Reach for this overlay when

- retrieval quality, chunking, metadata, or reranking matters more than base-model choice,
- the system needs grounded answers, citations, or hybrid lexical and vector search behavior,
- failure modes include stale indexes, low recall, weak chunk boundaries, or unfaithful answers.

## Working rules

- Keep corpus snapshots, chunking rules, metadata schema, embedding model choices, and index builds versioned as first-class artifacts separate from prompts or generators.
- Make retrieval knobs explicit: chunk size and overlap, metadata filters, vector store or index settings, hybrid search mix, reranking stage, top-k, and when retrieval should be skipped.
- Evaluate the full loop with labeled queries or review sets that cover retrieval recall, grounding or faithfulness, citation accuracy, latency, and answer usefulness before tuning prompts blindly.
- Monitor stale content, indexing lag, citation gaps, low-confidence reranks, and drift between source-of-truth documents and indexed content; keep rollback paths to the prior embedding or index version.

## Watchouts

- Avoid treating prompt changes as the main fix when recall, metadata, chunking, or reranking is the real failure point.
- Avoid rebuilding embeddings or indexes without version tags, backfill rules, and a rollback plan.
- Avoid claiming grounded output when retrieved passages, citations, or faithfulness checks are missing.
