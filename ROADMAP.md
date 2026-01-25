# Giovanna Product Roadmap

## Vision Statement

**Giovanna is the sovereign data home for every parent raising an autistic child.**

It is the single place where:
- Every observation, video, strategy, and milestone lives
- Care teams collaborate under parent governance
- AI learns your child deeply over their entire lifetime
- Professional documentation flows out on demand
- Parent wellness is honored as the foundation of child flourishing

**Stickiness through value**: The app becomes indispensable because it holds irreplaceable, longitudinal context that cannot be replicated elsewhere.

---

## Strategic Principles

### 1. Parent Sovereignty
The parent owns and governs all data. Care teams participate by invitation. Data export is always available - we earn loyalty through value, not lock-in.

### 2. Capture Everything, Surface Insights
Make it effortless to log observations (text, voice, video). The AI synthesizes patterns the parent might miss.

### 3. Lifetime Continuity
The app grows with the child from diagnosis through adulthood. Data structures support age-stage transitions.

### 4. Professional Bridge
Transform parent wisdom into documentation that institutions respect: IEP meetings, medical appointments, therapy sessions.

### 5. Parent-First Wellness
A dysregulated parent cannot regulate a child. The app actively supports parent mental health.

---

## Phase 1: Data Capture & Export Foundation
**Goal**: Make Giovanna the source of truth that parents can share anywhere

### 1.1 PDF/Document Export System
**Priority**: CRITICAL - Immediate value for IEP meetings, doctor visits

Features:
- Export single observation as formatted PDF
- Export date-range summary report
- Export full child profile with history
- Professional formatting with dignity-centered language
- Customizable templates (Medical, School, Therapy, Legal)

Technical:
- Client-side PDF generation (jsPDF or react-pdf)
- Template system matching Documenter agent output styles
- Share via native share API or download

### 1.2 Video Capture & Storage
**Priority**: HIGH - Differentiating feature

Features:
- Record video directly in app (30s - 5min clips)
- Attach video to observations
- Secure cloud storage (Firebase Storage)
- Video playback in Journey timeline
- Privacy controls (who can view)

Technical:
- MediaRecorder API for capture
- Firebase Storage with security rules
- Compressed video encoding
- Thumbnail generation

### 1.3 Enhanced Observation Types
**Priority**: HIGH - Richer data capture

Features:
- Quick-capture templates (Meltdown, Win, Sensory, Social)
- Photo attachment to observations
- Location tagging (optional - home, school, therapy, public)
- Duration tracking for episodes
- Intensity scale (1-5)

---

## Phase 2: Intelligence & Memory Layer
**Goal**: AI that truly knows your child and gets smarter over time

### 2.1 Longitudinal Memory System
**Priority**: CRITICAL - Core differentiator

Features:
- AI maintains running summary of child's patterns
- Identifies triggers, calming strategies, sensory preferences
- Tracks what works and what doesn't over time
- Surfaces relevant history during new observations
- "Remember when..." contextual suggestions

Technical:
- Vector embeddings of observations (for semantic search)
- Periodic AI-generated child summaries
- Context injection into Oracle prompts
- Memory tiers: Recent (30 days), Patterns (6 months), Lifetime

### 2.2 Video Analysis AI
**Priority**: HIGH - Expert-level insights from video

Features:
- Upload video, get AI analysis
- Identifies: body language, environmental factors, antecedents
- Suggests: regulation strategies, communication interpretations
- Strength-based framing (never deficit language)
- Links to similar past episodes

Technical:
- Vision AI integration (with consciousness guardrails)
- Frame sampling for analysis
- Transcript generation for audio
- PII detection in video (blur faces option for sharing)

### 2.3 Pattern Recognition Dashboard
**Priority**: MEDIUM - Visual insights

Features:
- Time-of-day patterns (when do challenges cluster?)
- Location patterns (where does child thrive/struggle?)
- Trigger frequency tracking
- Strategy effectiveness scores
- Progress visualization over months/years

---

## Phase 3: Skill Building & Resources
**Goal**: Structured growth tracking and intellectual home for parents

### 3.1 ABA/Skill Tracking Module
**Priority**: HIGH - Daily engagement driver

Features:
- Create custom skill goals (or use templates)
- Daily/weekly tracking with simple UI
- Progress graphs over time
- Link skills to IEP goals
- Celebrate milestones
- Export progress reports

Skill Categories:
- Communication (verbal, AAC, gestures)
- Daily Living (toileting, dressing, eating)
- Social (eye contact, turn-taking, greetings)
- Academic (pre-academic, reading, math)
- Motor (fine motor, gross motor)
- Self-Regulation (identifying emotions, coping strategies)

### 3.2 Strategy & Resource Library
**Priority**: MEDIUM - Intellectual home

Features:
- Curated evidence-based strategies
- Organized by challenge type
- Save favorites to personal library
- Add personal notes to strategies
- Track which strategies you've tried
- Community-contributed strategies (moderated)

Content Areas:
- Sensory regulation techniques
- Communication supports
- Transition strategies
- Meltdown prevention/recovery
- Sleep strategies
- Feeding/eating support
- Social skills development
- School accommodation ideas

### 3.3 Theory & Education Hub
**Priority**: MEDIUM - Parent empowerment

Features:
- Digestible explanations of autism neuroscience
- Epigenetic consciousness theory basics
- Understanding behavior as communication
- Advocacy training modules
- IEP rights and process guides
- Self-paced learning paths

---

## Phase 4: Lifetime Continuity
**Goal**: App grows with child from toddler through adulthood

### 4.1 Age-Stage Framework
**Priority**: HIGH - Long-term retention

Life Stages:
- Early Childhood (0-5): Early intervention focus
- School Age (6-12): IEP, social, academic
- Adolescence (13-17): Independence, puberty, identity
- Transition (18-21): Adult services, employment, higher ed
- Adulthood (22+): Independent living, employment, relationships

Features:
- Stage-appropriate UI and language
- Relevant goal templates per stage
- Transition planning tools
- Shift from parent-led to supported self-advocacy
- Adult child can gain account access (with parent blessing)

### 4.2 Care Team Evolution
**Priority**: MEDIUM - Team changes over time

Features:
- Archive past care team members (preserve history)
- Transition summaries for new providers
- "Introduce my child" shareable document
- Provider-specific views (what does the SLP need vs. teacher?)

### 4.3 Legacy & Continuity
**Priority**: LOW (but important for trust)

Features:
- Full data export (JSON, PDF archive)
- Account transfer capabilities
- Backup/restore system
- "If something happens to me" instructions for child's future caregivers

---

## Phase 5: Parent Wellness Expansion
**Goal**: Sustained support for the caregiver

### 5.1 Wellness Tracking
- Parent mood/energy check-ins
- Stress pattern identification
- Self-care reminders
- Celebrate parent wins

### 5.2 Community Connection
- Anonymous parent matching (similar child profiles)
- Moderated support discussions
- Local resource sharing
- Mentor matching (experienced parents)

### 5.3 Respite & Support
- Respite provider profiles
- Care instructions generator
- Emergency contact system
- Crisis resources

---

## Implementation Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| PDF Export | HIGH | LOW | **P0 - NOW** |
| Video Capture | HIGH | MEDIUM | **P0 - NOW** |
| Longitudinal Memory | CRITICAL | HIGH | **P1 - NEXT** |
| ABA/Skill Tracking | HIGH | MEDIUM | **P1 - NEXT** |
| Video AI Analysis | HIGH | HIGH | P2 |
| Resource Library | MEDIUM | MEDIUM | P2 |
| Pattern Dashboard | MEDIUM | MEDIUM | P2 |
| Age-Stage Framework | HIGH | MEDIUM | P3 |
| Theory Hub | MEDIUM | LOW | P3 |
| Parent Wellness | MEDIUM | LOW | P3 |
| Community Features | MEDIUM | HIGH | P4 |

---

## Success Metrics

### Engagement (Stickiness)
- Daily active users
- Observations per user per week
- Return rate after 30/60/90 days
- Care team invitations sent

### Value Delivered
- Documents exported
- Videos captured
- Skills tracked
- Care team members active

### Outcomes (Long-term)
- User retention at 1 year
- IEP meeting success stories
- Parent-reported stress reduction
- Child progress documentation

---

## Technical Considerations

### Data Architecture for Lifetime Use
- Firestore collections designed for years of data
- Efficient queries with proper indexing
- Archive strategies for older data
- Storage cost management for video

### Offline-First
- PWA with robust offline support
- Queue observations when offline
- Sync when connection returns
- Never lose parent's data

### Privacy at Scale
- End-to-end encryption for sensitive data
- HIPAA-awareness (not compliance yet, but designed for it)
- Consciousness guardrails on all AI
- Audit logging for care team access

---

## Next Steps

**Immediate (This Sprint)**:
1. Build PDF export for observations
2. Implement video capture UI
3. Design skill tracking data model

**This Month**:
4. Complete video storage pipeline
5. Launch basic skill tracking
6. Begin longitudinal memory architecture

**This Quarter**:
7. Video AI analysis (beta)
8. Resource library v1
9. Pattern recognition dashboard

---

*This roadmap is a living document. Priorities shift based on user feedback and what parents tell us they need most.*
