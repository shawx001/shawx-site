---
title: TaxGlobal AI
summary: A cent-accurate AI tax assistant — rules engine as the single source of truth, LLM as the interface.
role: Founder — architecture, product, review gates
stack: [Python, FastAPI, LangChain, Rules engine]
year: 2026
cover: /covers/taxglobal.svg
casePath: /work/taxglobal-ai
order: 1
---

## Problem

Tax software has zero tolerance for error: an answer that is off by one cent is a wrong answer. Most LLM products guess. A tax product has to prove.

## My approach

I built the system so the LLM never computes. A rules-as-data engine owns every number; agents own the conversation; and every change passes independent cent-accuracy review gates before it merges. Accuracy first, honest scope, escalate the hard cases to a human.

## Outcome

A stateless, idempotent calculation core covering multi-state scenarios, verified to the cent on every change — and an architecture that scales from a calculator into a full agent stack without rewrites.
