# GitHub Copilot Workspace Instructions

## Multi-Role Development Workflow

When working on tasks for this project, follow a structured multi-role approach that ensures thorough analysis, robust implementation, and comprehensive testing.

## Workflow Process

### 1. Task Classification

First, determine the task type:

- **FEATURE**: New functionality, enhancements, architectural changes
  - **Mode**: STRICT - Must follow full PM → Engineer → Reviewer → QA workflow
  - **Examples**: Add new card support, redesign UI, new subcap calculation logic
  
- **BUG**: Defect fixes, corrections, minor adjustments
  - **Mode**: FLEXIBLE - Can skip PM analysis, go directly to Engineer → Reviewer → QA
  - **Examples**: Fix calculation error, resolve display issue, patch security vulnerability

### 2. Role Sequence (STRICT Mode - Features)

For new features, follow this mandatory sequence:

#### Phase 1: Product Manager Analysis
**Consult**: `.github/agents/product-manager.md`

**Responsibilities**:
- Understand the user need and problem statement
- Define clear requirements and scope
- Write user stories with acceptance criteria
- Consider edge cases and card-specific implications
- Ensure privacy-first approach

**Output Required**:
- Problem statement
- Proposed solution approach
- User stories (As a [user], I want [feature] so that [benefit])
- Acceptance criteria (specific, testable)

#### Phase 2: Staff Engineer Design & Implementation
**Consult**: `.github/agents/staff-engineer.md`

**Responsibilities**:
- Review PM requirements and acceptance criteria
- Design technical architecture
- Implement the solution following project patterns
- Write maintainable, performant code
- Document implementation details

**Output Required**:
- Technical design overview
- Implementation approach (which modules/functions to modify)
- Code changes with explanations
- Performance and security considerations
- Technical documentation updates

#### Phase 3: Code Review & Validation
**Consult**: `.github/agents/code-reviewer.md`

**Responsibilities**:
- Review code quality and adherence to project patterns
- Validate implementation meets PM requirements
- Assess product alignment and user experience
- Identify risks and issues before testing
- Provide feedback to PM if requirements gaps found

**Output Required**:
- Product assessment (does it solve the user problem?)
- Code quality assessment (readability, maintainability, patterns)
- Technical review (correctness, performance, compatibility, privacy)
- Issues found (Critical/Major/Minor)
- Recommendation (APPROVE/APPROVE WITH COMMENTS/REQUEST CHANGES/REJECT)
- Feedback for PM (if requirements issues discovered)

**Decision Points**:
- **APPROVE or APPROVE WITH COMMENTS**: Proceed to QA
- **REQUEST CHANGES**: Back to Staff Engineer for revision
- **REJECT + Requirements Issues**: Back to PM for requirements clarification, then to Engineer
- **REJECT + Code Issues**: Back to Staff Engineer for redesign

#### Phase 3: QA Testing & Validation
**Consult**: `.github/agents/qa.md`

**Responsibilities**:
- Review acceptance criteria from PM
- Create comprehensive test plan
- Execute tests (network interception, storage, calculations, UI)
- Verify cross-browser compatibility
- Test edge cases and card-specific scenarios

**Output Required**:
- Test plan with scenarios
- Test execution results
- Regression test verification
- Browser compatibility confirmation
- Bug reports (if any issues found → back to Engineer → Reviewer)

### 3. Flexible Mode (Bugs)

For bug fixes, reviewer is recommended but optional:

#### Engineer → Reviewer → QA Flow (Recommended)
1. **Staff Engineer**: Diagnose root cause, implement fix, verify solution
2. **Code Reviewer**: Quick review for correctness and no regressions
3. **QA**: Test fix, verify no regressions, confirm across browsers

#### Engineer → QA Flow (Quick Fix)
1. **Staff Engineer**: Diagnose and implement obvious fix
2. **QA**: Test fix, verify no regressions

### 4. Combined Implementation Plan

**All outputs must be consolidated into a single implementation plan** with these sections:

```markdown
## Implementation Plan: [Task Name]

### Task Classification
- Type: [FEATURE | BUG]
- Mode: [STRICT | FLEXIBLE]

### Product Requirements (Features only)
[PM analysis output: problem, solution, user stories, acceptance criteria]

### Technical Implementation
[Engineer output: design, approach, code changes, considerations]

### Code Review Assessment
[Reviewer output: product assessment, code quality, technical review, recommendation]

### Testing & Validation
[QA output: test plan, scenarios, expected results]

### Summary
- Files to modify: [list]
- Estimated complexity: [Low | Medium | High]
- Key risks: [list any concerns]
- Review status: [APPROVED/APPROVED WITH COMMENTS/PENDING CHANGES]
```

## Project-Specific Guidelines

### Privacy First
- ALL data must stay local (browser storage only)
- NO external API calls for user data
- Network interception is read-only (clone responses)

### Card-Specific Logic
- **UOB PPV**: $600 limits, $5 rounding, contactless + online buckets
- **UOB VS**: $1,200 limits, $1,000 minimum, foreign currency + contactless buckets
- Always test with both card types

### Code Patterns
- Monkey patching with auto-recovery
- ES6+ JavaScript (async/await, arrow functions)
- Defensive programming (null checks, error handling)
- Debug mode for verbose logging

### Browser Compatibility
- **Desktop**: Chrome, Firefox, Safari, Opera, Edge
- **Mobile**: Edge Mobile only
- Test across multiple browsers before finalizing

## Usage Examples

### Example 1: New Feature (STRICT)
```
User request: "Add support for UOB One Card"

1. PM Analysis:
   - Problem: Users with UOB One Card cannot track their subcaps
   - Solution: Extend card detection and add One Card rules
   - User Story: As a UOB One Card holder, I want to see my subcap progress...
   - Acceptance Criteria: [list]

2. Engineer Implementation:
   - Design: Add card type detection for One Card
   - Modify: cardConfig object, calculation logic, UI display
   - Code: [implementation details]

3. Code Review:
   - Product: Solves user problem, meets acceptance criteria
   - Code Quality: Clean, maintainable, follows patterns
   - Technical: Logic correct, privacy preserved, browser compatible
   - Recommendation: APPROVE WITH COMMENTS (minor style suggestions)

4. QA Testing:
   - Test Plan: Verify One Card detection, calculation accuracy, UI display
   - Execute: Test with One Card transactions
   - Results: [test outcomes]

Combined Plan: [consolidated output]
```

### Example 2: Bug Fix (FLEXIBLE)
```
User request: "Contactless transactions are being double-counted"

1. Engineer Diagnosis & Fix:
   - Root Cause: Transaction filtering logic not deduplicating
   - Solution: Add transaction ID check before counting
   - Code: [implementation]

2. Code Review:
   - Technical: Logic fix is correct, no regressions expected
   - Code Quality: Clean implementation, proper error handling
   - Recommendation: APPROVE

3. QA Validation:
   - Test: Verify no double-counting with duplicate transactions
   - Regression: Ensure other calculations still work
   - Results: [test outcomes]

Combined Plan: [consolidated output]
```

## Agent File References

- **Product Manager**: `.github/agents/product-manager.md`
- **Staff Engineer**: `.github/agents/staff-engineer.md`
- **Code Reviewer**: `.github/agents/code-reviewer.md`
- **QA Engineer**: `.github/agents/qa.md`

## Notes

- Always produce a **single, combined implementation plan** rather than separate documents
- For ambiguous tasks, default to STRICT mode (better safe than sorry)
- **Code review is a quality gate** - implementations must be approved before QA testing
- If Reviewer finds requirements issues, loop back to PM for clarification
- If Reviewer finds code issues, loop back to Engineer for revision
- If QA finds bugs, loop back to Engineer → Reviewer → QA
- Document any deviations from the standard workflow
