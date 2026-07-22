# `database/`

Repository-level database references that live outside the Laravel
app so they're easy to hand to a DBA, open in a diagramming tool, or
diff independently of migration history.

- `erd/` — entity-relationship diagrams (added as the schema grows
  past the Phase 1 `users` table).
- `schema/` — plain-SQL snapshots of the schema for environments that
  provision a database without running Artisan migrations.

The actual, authoritative schema is always the migrations in
`backend/database/migrations/` — files here are generated references,
not a second source of truth.
