---
title: VeriUBO
summary: An AI corporate due-diligence workbench — 9 FATF gates, cyclic UBO forensics, OFAC 50% Rule, and a zero-leak client portal.
role: Creator — product, design, full-stack architecture
stack: [TypeScript, React, Python, FastAPI, Local LLM, Leontief Solver]
year: 2026
casePath: /work/veriubo
order: 1
---

## Problem

Corporate bank onboarding (KYB) has zero room for hand-waving: who owns the company through layered holdings, whether a sanctions alias is a real match or a namesake, and what happens when registry details change after approval.

## My approach

Keep the AI on investigation and triage; keep every equity calculation, date check, OFAC FAQ 401 50% Rule aggregation, and approval gate deterministic on the server. Separate three real personas — case analyst, independent senior approver, and a zero-leak client self-service portal — inside a calm legal-binder dossier.

## Outcome

Shipped v2.1 covering nine FATF corporate due-diligence gates: verified with a 35-tool-call local Qwen2.5-0.5B-Instruct lifecycle replay and live ingestion of 19,629 public OFAC SDN records plus GLEIF LEI lookups.
