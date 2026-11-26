---
title: VeriUBO
summary: 企业客户尽调 AI 工作台 —— 九项 FATF 合规门禁、循环股权穿透、OFAC 50% Rule 与零泄露客户补件门户。
role: 主创 —— 产品、交互设计、系统架构
stack: [TypeScript, React, Python, FastAPI, 本机 LLM, Leontief 求解器]
year: 2026
casePath: /zh/work/veriubo
order: 1
---

## 问题

企业银行开户尽调（KYB）容不得含糊：穿透多层与循环持股后究竟谁控制公司、制裁名单别名命中究竟是同名误报还是风险主体、批准之后登记发生变更该如何追责重审。

## 我的方案

让 AI 专注后台调查、补件跟进与待办推送，让所有股权计算、期限规则、OFAC FAQ 401（50% Rule）受制裁股东归集与审批阻断由后端确定性执行；在极简卷宗夹交互下拆清经办分析员、独立高级审批官与零泄露客户补件门户三种真实角色。

## 结果

已交付 v2.1 九项企业尽调闭环：实测本机 Qwen2.5-0.5B-Instruct 在八个阶段完成 35 次工具调用回放，并接入 19,629 条公开 OFAC SDN 名单本地筛查与 GLEIF LEI 实时查册。
