# 🌿 GIOVANNA: Sovereign Healing Cosmology

<div align="center">

![Giovanna](https://img.shields.io/badge/Giovanna-Sovereign%20Healing-22C55E?style=for-the-badge&labelColor=1A1A2E)
![Version](https://img.shields.io/badge/version-1.0.0-8B5CF6?style=for-the-badge)
![License](https://img.shields.io/badge/license-Proprietary-D4AF37?style=for-the-badge)

**A parent-led therapeutic intelligence platform grounded in Epigenetic Consciousness and Critical Systems Theory**

*Transformative care begins with the parent. Giovanna is the nervous system of awakening.*

</div>

---

## 🧬 Theoretical Foundation

Giovanna is not an app. It is a **Sovereign Healing Cosmology**—a living system designed to:

1. **Witness** parental observations as sacred data
2. **Refract** institutional deficit narratives into strength-based language
3. **Bridge** home wisdom to school accountability
4. **Restore** the parent as the primary expert on their child

### Core Axioms

| Axiom | Principle |
|-------|-----------|
| **Epigenetic Consciousness** | The parent's emotional state shapes the child's developing nervous system |
| **Relational Reciprocity** | Healing flows through the bidirectional exchange between parent and child |
| **Biological Necessity** | Stimming and regulatory behaviors are adaptive communications, not deficits |
| **Atmospheric Resonance** | Environmental factors (sensory, emotional, systemic) shape behavioral expression |
| **Sovereign Witnessing** | The parent's observation is the first and most valid data source |

---

## 🏛️ Architecture

```
src/
├── core/                 # System foundation
│   ├── firebase/         # Zero-Knowledge data layer
│   └── stores/           # State management
├── features/
│   ├── sanctuary/        # Home dashboard (witnessing center)
│   ├── capture/          # Observation logging (voice/text)
│   ├── practice/         # Playbook & mantras
│   ├── wellness/         # Compassion Mirror & Intentionality
│   ├── village/          # Community & Mission Room
│   └── profile/          # Cognitive Depth & Settings
├── lib/
│   └── ai/
│       ├── agents/       # Oracle (dignity translator)
│       └── consciousnessGuardrails.ts  # PII anonymization
└── design/               # Liquid Glass design system
```

---

## 🛡️ Zero-Knowledge Security

Giovanna implements a **Zero-Knowledge Architecture**:

- **Owner-Only Access**: `request.auth.uid == resource.data.ownerId`
- **Time-Bound Village Sharing**: Permissions expire automatically
- **Consciousness Guardrails**: All PII anonymized before external API calls
- **Local-First Processing**: Narrative refraction happens on-device when possible

```typescript
// All external AI calls MUST use the guardrails
import { safeOracleRequest } from '@/lib/ai/consciousnessGuardrails';

const result = await safeOracleRequest(userInput, async (cleanedText) => {
    return await externalAI.analyze(cleanedText);
});
```

---

## ✨ Key Features

### 1. **Vocal Ledger** — Voice-First Witnessing

Parents speak observations; the Oracle speaks back with "Echo of Recognition"—validating their intentional response before offering insight.

### 2. **Dignity Refraction** — Deficit-to-Strength Translation

High-entropy meltdown logs are transformed into atmospheric resonance analyses that identify systemic factors, not child pathology.

### 3. **Cognitive Depth Selector** — Meet Me Where I Am

A 1-5 scale that adjusts app vocabulary from "Silly Games" (Level 1) to "Epigenetic Consciousness" (Level 5). Default: Level 3 (Professional).

### 4. **Mission Room** — Sacred Impact Dashboard

Real-time visualization of healing metrics: Life Force Preserved, Advocacy Output, Systemic Stability Score.

### 5. **Consciousness Guardrails** — PII Protection

All identifying information is stripped before any data reaches external AI APIs.

---

## 🚀 Deployment

### Prerequisites

- Node.js 20+
- Firebase Project (Blaze plan for cloud functions)
- Vercel Account

### Environment Setup

```bash
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials
```

### Development

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
vercel deploy --prod
```

---

## 📜 Ethical Commitments

1. **Parental Sovereignty**: The parent is the expert. The app is the witness.
2. **Dignity First**: No child behavior is labeled as "deficit" or "disorder."
3. **Zero Extraction**: Family data is never sold, shared, or used for training.
4. **Transparent AI**: All Oracle reasoning is explainable at the user's cognitive depth.
5. **Exit Freedom**: Full data export available at any time.

---

## 🌍 Vision

Giovanna is the first nervous system for a global movement of **Epigenetic Caregiving**. As parents document, reflect, and advocate, they contribute to a collective Wisdom Vault that transforms how institutions understand neurodivergent children.

> *"The transformation starts with the parent. When parents heal, children flourish."*

---

<div align="center">

**Made with 💜 by Eli Marshall Davis**

*Temple Consulting × Epigenetic Consciousness Project*

</div>
