# Product Roadmap Summary - Q4 2025 to Q3 2026

This document provides a high-level overview of the HeyMax SubCaps Viewer product roadmap, organized by phase and priority.

## Vision

Transform HeyMax SubCaps Viewer from a basic subcap calculator into a comprehensive spending optimization tool that:
- **Empowers users** to maximize credit card rewards
- **Respects privacy** with 100% local-only data processing
- **Supports multiple cards** beyond just UOB PPV and UOB VS
- **Provides insights** through historical tracking and projections
- **Reduces friction** with always-available quick access

## Roadmap Phases

### Phase 1: Core Improvements (Q4 2025) - Foundation

**Goal**: Address fundamental limitations and add essential features

| Priority | Feature | Effort | Status |
|----------|---------|--------|--------|
| **P1** | [Data Export & History](./01-data-export-history.md) | Medium | Proposed |
| **P1** | [Smart Notifications](./02-smart-notifications.md) | Medium | Proposed |
| **P1** | [Multi-Period Tracking](./04-multi-period-tracking.md) | High | Proposed |

**Why Phase 1 matters:**
- **Multi-Period Tracking** fixes critical limitation: subcaps reset monthly but script shows all-time totals
- **Data Export** addresses user anxiety about data loss and enables record-keeping
- **Smart Notifications** reduces need to constantly check, improves UX

**Expected Impact:**
- Calculation accuracy improves from ~70% to ~95% (period awareness)
- User anxiety reduced (export + notifications)
- Time savings: 5-10 checks per day → 1-2 checks + notifications

---

### Phase 2: Enhanced Experience (Q1 2026) - Usability

**Goal**: Improve day-to-day user experience and reduce friction

| Priority | Feature | Effort | Status |
|----------|---------|--------|--------|
| **P2** | [Spending Projections](./05-spending-projections.md) | Medium | Proposed |
| **P2** | [Transaction Categorization](./06-transaction-categories.md) | Medium | Proposed |
| **P2** | [Quick View Widget](./07-quick-view-widget.md) | Medium | Proposed |
| **P2** | [Data Backup & Restore](./08-data-backup-restore.md) | Low | Proposed |

**Why Phase 2 matters:**
- **Quick View Widget** eliminates multi-step process to check subcaps
- **Spending Projections** enables proactive optimization ("will I hit limit?")
- **Transaction Categorization** helps users understand spending patterns
- **Data Backup** provides peace of mind for power users

**Expected Impact:**
- Friction reduced: 4 clicks → 1 hover (widget)
- Planning improved: reactive → proactive (projections)
- User confidence increased (backup/restore)

---

### Phase 3: Multi-Card Expansion (Q2 2026) - Growth

**Goal**: Expand user base by supporting more credit cards

| Priority | Feature | Effort | Status |
|----------|---------|--------|--------|
| **P1** | [Additional UOB Cards](./09-uob-cards-expansion.md) | Medium | Proposed |
| **P2** | [DBS/POSB Cards](./10-dbs-posb-cards.md) | High | Proposed |
| **P2** | [OCBC Cards](./11-ocbc-cards.md) | High | Proposed |
| **P3** | [Citi Cards](./12-citi-cards.md) | High | Proposed |

**Why Phase 3 matters:**
- Current tool serves only UOB PPV/VS holders (small market segment)
- Many HeyMax users have multiple cards from different banks
- Expanding card support = 5-10x potential user base
- Network effects: more users → more contributions → better tool

**Expected Impact:**
- User base growth: 2-3x (UOB cards) → 5-10x (multi-bank)
- Market position: niche tool → essential HeyMax companion
- Community contributions increase (more stakeholders)

**Priority Rationale:**
- UOB cards first (P1): Same bank, similar API patterns, lower complexity
- DBS/POSB next (P2): Largest bank in Singapore, biggest potential impact
- OCBC after (P2): Second largest bank
- Citi last (P3): Smaller market share, complex international structures

---

### Phase 4: Power User Features (Q3 2026) - Advanced

**Goal**: Serve power users and enable community customization

| Priority | Feature | Effort | Status |
|----------|---------|--------|--------|
| **P3** | [Custom Rules Engine](./13-custom-rules.md) | High | Proposed |
| **P2** | [Goal Setting & Tracking](./14-goal-tracking.md) | Medium | Proposed |
| **P2** | [Card Comparison Tool](./15-card-comparison.md) | Medium | Proposed |

**Why Phase 4 matters:**
- **Custom Rules** enables users to define their own card structures (long tail)
- **Goal Tracking** transforms tool from passive calculator to active optimizer
- **Card Comparison** helps users choose which card to use for purchases

**Expected Impact:**
- Long-tail support: unlimited cards via custom rules
- User engagement: passive monitoring → active optimization
- Retention: tool becomes indispensable part of workflow

---

## Feature Status Legend

- **Proposed**: Feature documented, awaiting implementation
- **In Development**: Engineering work in progress
- **In Review**: Code review or QA testing
- **Released**: Available to users
- **Deferred**: Postponed to future phase
- **Cancelled**: Will not be implemented

## Priority Framework

### P0: Critical (Blocker)
- Fixes broken functionality
- Addresses data loss or security issues
- Essential for core value proposition

### P1: High (Should Have)
- Significant user pain point
- High impact on key metrics
- Addresses fundamental limitations

### P2: Medium (Nice to Have)
- Improves user experience
- Moderate impact on engagement
- Enhances but doesn't fundamentally change value prop

### P3: Low (Future)
- Low urgency improvements
- Niche use cases
- High effort, uncertain ROI

## Selection Criteria

Features prioritized based on:

1. **User Impact** (Weight: 40%)
   - How many users benefit?
   - How significantly does it improve their experience?
   - Does it solve a painful problem?

2. **Privacy Alignment** (Weight: 25%)
   - Maintains local-only data processing?
   - No external dependencies?
   - Enhances user control over data?

3. **Technical Feasibility** (Weight: 20%)
   - Can be built with current architecture?
   - Browser compatibility maintained?
   - Performance impact acceptable?

4. **Strategic Value** (Weight: 15%)
   - Enables future features?
   - Expands user base?
   - Strengthens competitive position?

## Trade-offs & Constraints

### Non-Negotiable Constraints
- ✅ **Privacy-first**: No external data transmission, ever
- ✅ **Browser-only**: No server-side components
- ✅ **Cross-browser**: Must work on all supported browsers
- ✅ **Mobile-friendly**: Edge Mobile support maintained

### Strategic Trade-offs
- **Breadth vs Depth**: Phase 1-2 focus on depth (better UOB experience), Phase 3 on breadth (more cards)
- **Power vs Simplicity**: Essential features first, power features later
- **Automation vs Control**: Smart defaults + user overrides
- **Innovation vs Reliability**: Proven approaches prioritized

## Success Metrics

### North Star Metric
**User Subcap Optimization Rate**: % of users who consistently hit (but don't exceed) their subcap limits

### Supporting Metrics

**Engagement:**
- Daily active users
- Average checks per user per day
- Feature adoption rates

**Value Delivery:**
- Calculation accuracy rate
- Time saved per user (vs manual tracking)
- User-reported rewards optimization

**Growth:**
- New user acquisition rate
- User retention (30-day, 90-day)
- Multi-card user percentage

**Technical:**
- Page load impact (<100ms target)
- Error rate (<0.1% target)
- Cross-browser compatibility (>95% success rate)

## How to Influence the Roadmap

### For Users
- **Feature requests**: Open GitHub issues with use cases
- **Voting**: Comment on feature proposals to show demand
- **Testing**: Help test beta features and provide feedback

### For Contributors
- **Pick a feature**: Choose from roadmap and follow workflow
- **Propose new features**: Use template in `.roadmap/README.md`
- **Improve existing**: Suggest enhancements to proposed features

### For Stakeholders
- **Strategic input**: Discuss priorities and phase timing
- **Market research**: Share insights on user needs
- **Partnership**: Explore integration opportunities

## Roadmap Updates

This roadmap is a living document:
- **Quarterly review**: Reassess priorities and timing
- **Feature graduation**: Move features between phases based on learnings
- **New additions**: Incorporate user feedback and market changes
- **Sunset**: Remove features that no longer align with vision

**Last Updated**: 2025-12-01  
**Next Review**: 2026-03-01  
**Version**: 1.0

---

## Quick Reference

**Phase 1 (Q4 2025)**: Fix fundamentals  
**Phase 2 (Q1 2026)**: Improve experience  
**Phase 3 (Q2 2026)**: Expand cards  
**Phase 4 (Q3 2026)**: Power features  

**Total Features**: 15 proposed  
**High Priority (P1)**: 4 features  
**Medium Priority (P2)**: 8 features  
**Low Priority (P3)**: 3 features  

For detailed feature specifications, see individual feature documents in `.roadmap/` directory.
