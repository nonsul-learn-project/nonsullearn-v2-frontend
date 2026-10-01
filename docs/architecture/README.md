# Architecture

V2 is a Next.js experience layer. It will communicate with the existing PHP system only through explicit contracts and adapters in `src/legacy`.

PHP remains the system of record and owner of existing business logic.
