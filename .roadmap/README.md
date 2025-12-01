# HeyMax SubCaps Viewer — Product Roadmap

This directory contains the product roadmap for the HeyMax SubCaps Viewer project. Each feature proposal is documented with problem statements, user stories, acceptance criteria, and priority levels.

## Purpose

The roadmap helps us:
- **Understand user needs** - Document real user problems that need solving
- **Prioritize features** - Decide what to build first based on user impact
- **Maintain focus** - Keep the product privacy-first and user-centric
- **Guide development** - Provide clear requirements for engineering work

## Roadmap Structure

Features are organized by priority and category:

### Priority Levels
- **P0 (Critical)** - Blocking issues or essential features for core functionality
- **P1 (High)** - Significant user impact, should be addressed soon
- **P2 (Medium)** - Nice-to-have improvements that enhance experience
- **P3 (Low)** - Future considerations, low urgency

### Categories
- **User Experience** - Interface and usability improvements
- **Data & Insights** - Better analytics and visualizations
- **Multi-Card** - Support for additional credit cards
- **Performance** - Speed and reliability improvements
- **Developer Experience** - Tools and workflows for contributors

## Current Roadmap

### Phase 1: Core Improvements (Q4 2025)
1. [**Data Export & History**](./01-data-export-history.md) - P1
2. [**Smart Notifications**](./02-smart-notifications.md) - P1
3. [**Spending Insights Dashboard**](./03-spending-insights.md) - P2
4. [**Multi-Statement Period Support**](./04-multi-period-tracking.md) - P1

### Phase 2: Enhanced Experience (Q1 2026)
5. [**Spending Projections**](./05-spending-projections.md) - P2
6. [**Transaction Categorization**](./06-transaction-categories.md) - P2
7. [**Quick View Widget**](./07-quick-view-widget.md) - P2
8. [**Data Backup & Restore**](./08-data-backup-restore.md) - P2

### Phase 3: Multi-Card Expansion (Q2 2026)
9. [**Additional UOB Cards**](./09-uob-cards-expansion.md) - P1
10. [**DBS/POSB Cards**](./10-dbs-posb-cards.md) - P2
11. [**OCBC Cards**](./11-ocbc-cards.md) - P2
12. [**Citi Cards**](./12-citi-cards.md) - P3

### Phase 4: Power User Features (Q3 2026)
13. [**Custom Rules Engine**](./13-custom-rules.md) - P3
14. [**Goal Setting & Tracking**](./14-goal-tracking.md) - P2
15. [**Card Comparison Tool**](./15-card-comparison.md) - P2

## How to Use This Roadmap

### For Users
Browse features to see what's coming and understand our product direction. Features are prioritized based on user impact and technical feasibility.

### For Contributors
Pick a feature that interests you and follow the workflow in `.github/copilot-instructions.md`:
1. Read the feature proposal document
2. Follow PM → Engineer → Reviewer → QA workflow
3. Submit a PR with your implementation

### For Product Managers
When adding new features:
1. Create a new markdown file in `.roadmap/`
2. Follow the template structure (see any existing feature file)
3. Include: Problem Statement, User Stories, Acceptance Criteria, Risks
4. Add entry to this README with priority and phase
5. Submit PR for review and discussion

## Feature Request Template

```markdown
# Feature Name

**Priority**: P1 | **Category**: User Experience | **Estimated Effort**: Medium

## Problem Statement
[Clear description of the user problem this solves]

## Proposed Solution
[High-level approach to solving the problem]

## User Stories

### Story 1: [Title]
**As a** [user type]
**I want** [feature]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2

## Out of Scope
[What this feature does NOT include]

## Privacy & Security Considerations
[How this feature maintains privacy-first approach]

## Risks & Considerations
[Potential issues to be aware of]

## Dependencies
[Other features or changes this depends on]

## Success Metrics
[How we'll measure if this feature is successful]
```

## Contribution Guidelines

All feature proposals should:
1. ✅ Solve a real user problem (not just "nice to have")
2. ✅ Maintain privacy-first principle (no external data transmission)
3. ✅ Work across all supported browsers
4. ✅ Include specific acceptance criteria
5. ✅ Consider both UOB PPV and UOB VS cards

## Questions or Feedback?

- **Feature suggestions**: Open an issue on GitHub
- **Priority discussions**: Comment on feature proposal PRs
- **Technical questions**: See `docs/TECHNICAL_DESIGN.md`

---

**Last Updated**: 2025-12-01  
**Status**: Active Development
