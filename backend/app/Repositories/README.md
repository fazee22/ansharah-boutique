# `app/Repositories`

Reserved for data-access abstraction (e.g. `ProductRepository`,
`OrderRepository`) once the catalog and order domains exist. Kept
empty in Phase 1 rather than seeded with speculative interfaces —
Eloquent models plus `app/Services` are sufficient until a domain
needs query complexity or caching that warrants the extra layer.
