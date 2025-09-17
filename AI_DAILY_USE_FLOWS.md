# AI Daily - Use Flow Documentation
Version 1.0

## Executive Summary
AI Daily is a content curation and review platform that enables users to efficiently process and approve AI-discovered trending topics for social media content creation. The system emphasizes rapid review workflows with a minimum commentary requirement to ensure quality content decisions.

## 1. Functional Requirements

### 1.1 Topic Discovery and Import
| Requirement ID | Description | Priority | Current Status | Implementation Notes |
|---------------|-------------|----------|----------------|---------------------|
| FR-001 | Automatic topic discovery from Perplexity AI | CRITICAL | Functional | Scheduled discovery runs |
| FR-002 | Store discovered topics in Supabase database | CRITICAL | Functional | Real-time sync enabled |
| FR-003 | Categorize topics by momentum (breaking, peaking, critical, emerging) | HIGH | Functional | Auto-categorization active |
| FR-004 | Track technical depth rating (1-5 scale) | MEDIUM | Functional | AI-generated scoring |
| FR-005 | Track viral potential rating (1-5 scale) | MEDIUM | Functional | AI-generated scoring |
| FR-006 | Generate content hooks for each topic | HIGH | Functional | AI-powered generation |
| FR-007 | Capture relevance context | MEDIUM | Functional | Stored with each topic |

### 1.2 User Review Interface
| Requirement ID | Description | Priority | Current Status | Implementation Notes |
|---------------|-------------|----------|----------------|---------------------|
| FR-008 | Display pending topics in clean list view | CRITICAL | Functional | Single-column layout |
| FR-009 | Show topic metadata (momentum, scores, age) | HIGH | Functional | Inline display |
| FR-010 | Provide inline commentary input | CRITICAL | Functional | Textarea in each card |
| FR-011 | Real-time character count with visual feedback | HIGH | Functional | Green at 100+ chars |
| FR-012 | Enable quick approval with single click | CRITICAL | Functional | Prominent green button |
| FR-013 | Support topic archival | HIGH | Functional | Archive button available |
| FR-014 | Filter topics by status (pending/approved/archived) | HIGH | Functional | Tab-based filtering |
| FR-015 | Search topics by title and content | MEDIUM | Functional | Real-time search |

### 1.3 Content Approval Workflow
| Requirement ID | Description | Priority | Current Status | Implementation Notes |
|---------------|-------------|----------|----------------|---------------------|
| FR-016 | Enforce 100-character minimum commentary | CRITICAL | Functional | Button disabled until met |
| FR-017 | Save commentary drafts automatically | HIGH | Functional | onBlur auto-save |
| FR-018 | Update topic status on approval | CRITICAL | Functional | Instant status change |
| FR-019 | Track approval timestamp | MEDIUM | Functional | Stored in database |
| FR-020 | Remove approved topics from pending view | HIGH | Functional | Real-time UI update |

### 1.4 Data Persistence
| Requirement ID | Description | Priority | Current Status | Implementation Notes |
|---------------|-------------|----------|----------------|---------------------|
| FR-021 | Real-time sync with Supabase | CRITICAL | Functional | WebSocket subscriptions |
| FR-022 | Persist commentary across sessions | HIGH | Functional | Database storage |
| FR-023 | Maintain topic history | MEDIUM | Functional | All states preserved |
| FR-024 | Export topics to CSV | LOW | Functional | Download feature |

### 1.5 User Experience
| Requirement ID | Description | Priority | Current Status | Implementation Notes |
|---------------|-------------|----------|----------------|---------------------|
| FR-025 | Clean, modern light-only interface | HIGH | Functional | No dark mode |
| FR-026 | Responsive design for desktop use | HIGH | Functional | Optimized layouts |
| FR-027 | Visual momentum indicators | MEDIUM | Functional | Color-coded badges |
| FR-028 | Loading states for async operations | MEDIUM | Functional | Spinner animations |
| FR-029 | Success/error toast notifications | MEDIUM | Functional | User feedback system |

## 2. System Use Cases

### UC-001: Daily Topic Review Workflow
**Primary Actor:** Content Creator / Social Media Manager

**Preconditions:**
- User has access to the AI Daily dashboard
- Topics have been automatically discovered by the system

**Primary Flow:**
1. User opens AI Daily dashboard
2. System displays count of pending topics prominently
3. User views list of pending topics sorted by recency
4. For each interesting topic:
   a. User reads the topic title and summary
   b. User checks momentum indicator (breaking/peaking/critical/emerging)
   c. User reviews technical depth and viral potential scores
   d. User types their commentary in the inline textarea
   e. Character count updates in real-time
   f. When 100+ characters entered, approve button activates
   g. User clicks approve button
   h. Topic moves to approved status and disappears from pending
5. For uninteresting topics:
   a. User clicks archive button
   b. Topic moves to archived status immediately
6. User continues until all relevant topics processed

**Alternative Flows:**
- 4d. User saves draft commentary → System auto-saves on blur
- 4g. User wants more detail → Clicks topic card to open detailed modal
- 3a. User searches for specific topic → Uses search bar to filter

**Success Metrics:**
- Average review time per topic: <30 seconds
- Commentary quality: 100+ characters of meaningful input
- Daily processing rate: 20-50 topics reviewed

### UC-002: Commentary and Approval Process
**Primary Actor:** Content Reviewer

**Preconditions:**
- Topic is in pending status
- User has identified topic as relevant

**Primary Flow:**
1. User identifies relevant topic in pending list
2. User begins typing commentary in inline textarea
3. System displays character count (e.g., "45/100")
4. User continues adding thoughts about:
   - Why this topic matters to their audience
   - Potential content angles
   - Platform-specific considerations
5. Character count reaches 100, indicator turns green with checkmark
6. Approve button changes from gray/disabled to bright green
7. User clicks approve button
8. System:
   a. Updates topic status to "approved"
   b. Saves commentary to database
   c. Records approval timestamp
   d. Shows success toast notification
   e. Removes topic from pending view
9. Topic appears in approved tab with green indicator

**Alternative Flows:**
- 3a. User leaves field before 100 chars → Commentary saved as draft
- 7a. User decides against approval → Can still save draft and return later
- 8e. Network error → System retries and shows error if persistent

### UC-003: Topic Discovery and Filtering
**Primary Actor:** Content Strategist

**Preconditions:**
- Multiple topics exist in various states

**Primary Flow:**
1. User accesses dashboard
2. User sees statistics bar showing:
   - Number of pending topics
   - Number of approved topics
3. User can switch between tabs:
   - Pending (default view)
   - Approved
   - Archived
4. Within any tab, user can:
   a. Search by keyword in search bar
   b. View results instantly filtered
   c. See topics sorted by most recent first
5. User identifies high-momentum topics by color-coded badges:
   - Red: Breaking news
   - Orange: Peaking interest
   - Purple: Critical developments
   - Blue: Emerging trends

**Alternative Flows:**
- 4a. No results found → System shows "No topics found" message
- 5a. User wants to export → Clicks export button for CSV download

### UC-004: Batch Processing Session
**Primary Actor:** Content Manager

**Preconditions:**
- Multiple pending topics accumulated
- User has dedicated time for review

**Primary Flow:**
1. User opens dashboard, sees pending count (e.g., "35 pending")
2. User begins rapid review mode:
   a. Scan topic title and metrics
   b. Make quick decision: relevant or not
   c. If not relevant → immediate archive
   d. If relevant → add quick commentary
3. For relevant topics:
   a. Type 100-150 character commentary
   b. Hit approve as soon as minimum met
   c. Move to next topic immediately
4. User processes 20+ topics in single session
5. Approved topics ready for content creation
6. Dashboard shows progress through reduced pending count

**Success Metrics:**
- Processing speed: 20+ topics in 10 minutes
- Decision accuracy: <5% topics need re-review
- Commentary quality: Actionable insights for content creation

## 3. Current Implementation Status

### Fully Functional Features
- Topic discovery and import from Perplexity AI
- Real-time Supabase integration
- Clean, single-column topic display
- Inline commentary with character counting
- One-click approval and archive actions
- Tab-based filtering (pending/approved/archived)
- Search functionality
- Export to CSV
- Responsive light-mode design

### Key Differentiators from AllAboutFood
| Aspect | AllAboutFood | AI Daily |
|--------|--------------|----------|
| Primary Purpose | Recipe management & voice cooking | Content curation & approval |
| Input Method | File upload, OCR, voice | Automated AI discovery |
| Core Interaction | Voice commands while cooking | Text commentary and approval |
| User Goal | Hands-free cooking assistance | Rapid content decision-making |
| Critical Feature | Voice navigation | 100-character commentary requirement |
| Platform Focus | Multi-platform with Alexa/Siri | Web-first dashboard |
| Data Type | Recipes with ingredients/steps | Trending topics with metadata |
| Monetization | Premium recipe purchases | N/A (internal tool) |

## 4. Success Metrics and KPIs

### Efficiency Metrics
- **Topic Review Rate:** 2-3 topics per minute
- **Daily Processing:** 50+ topics reviewed per day
- **Commentary Quality:** 100% meet 100-character minimum
- **Approval Rate:** 30-40% of discovered topics approved

### User Experience Metrics
- **Time to First Action:** <5 seconds after page load
- **Click to Approval:** 2 clicks maximum (textarea + approve)
- **Page Load Speed:** <2 seconds
- **Search Response:** <100ms

### System Performance
- **Real-time Sync:** <500ms latency
- **Auto-save Reliability:** 100% success rate
- **Uptime:** 99.9% availability
- **Concurrent Users:** Supports team collaboration

## 5. Conclusion
AI Daily successfully implements a streamlined workflow for content curation and approval, with all critical features functional. The system's emphasis on rapid review with quality commentary ensures efficient processing of AI-discovered content while maintaining human oversight and strategic input.