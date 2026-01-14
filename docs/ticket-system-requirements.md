# Ticket System - Team Feedback & Requirements

**Date:** 2026-01-12
**Participants:** Tech Founder, CS Operations
**Status:** Approved for Development

---

## Overview

This document captures the requirements gathered from the internal ticket system discussion. These features will enhance the existing ticket system to support CS operations effectively.

---

## Approved Features

### 1. Dashboard with KPIs/OKRs

**Priority:** High
**Description:** A comprehensive dashboard displaying key performance indicators for ticket management.

**Required Metrics:**
- [ ] Total open tickets (by priority breakdown)
- [ ] Average resolution time (by priority)
- [ ] Average first response time
- [ ] Tickets created today/this week/this month
- [ ] Tickets resolved today/this week/this month
- [ ] Backlog trend (open tickets over time)
- [ ] Tickets by category/type distribution
- [ ] SLA compliance rate (% resolved within target time)
- [ ] Tickets per owner/agent workload

**OKR Targets (to be defined):**
- Target first response time: _____ hours
- Target resolution time (by priority):
  - Urgente: _____ hours
  - Alta: _____ hours
  - Média: _____ hours
  - Baixa: _____ hours
- Target SLA compliance: _____%

**UI Requirements:**
- Summary cards at top with key numbers
- Charts for trends over time
- Filterable by date range
- Exportable to CSV/PDF (future)

---

### 2. File Attachments

**Priority:** High
**Description:** Allow users to attach files to tickets for better context and documentation.

**Supported File Types:**
- Images: PNG, JPG, JPEG, GIF, WebP
- Videos: MP4, MOV, WebM
- Documents: PDF (future consideration)

**Requirements:**
- [ ] Upload multiple files per ticket
- [ ] Upload on ticket creation
- [ ] Upload on existing tickets (via edit or comments)
- [ ] Image preview/thumbnail in ticket view
- [ ] Video player embed for video files
- [ ] File size limit: _____ MB per file (TBD)
- [ ] Total storage limit per ticket: _____ MB (TBD)
- [ ] Download original file
- [ ] Delete attachment (by creator or admin)

**Technical Considerations:**
- Storage solution: S3/Cloudflare R2/Supabase Storage
- CDN for fast delivery
- Virus/malware scanning (future)

---

### 3. Comments System

**Priority:** High
**Description:** Enable team collaboration through comments on tickets.

**Requirements:**
- [ ] Add comments to any ticket
- [ ] Edit own comments (within time limit?)
- [ ] Delete own comments
- [ ] Rich text support (bold, italic, links, code blocks)
- [ ] @mention team members in comments
- [ ] Attach files to comments
- [ ] Timestamp and author display
- [ ] Comment count visible on ticket list
- [ ] Activity timeline showing comments + status changes

**Comment Types:**
- Internal comments (visible to team only)
- Future: Public comments (visible to client)

---

### 4. Edit Tickets

**Priority:** Critical
**Status:** IMPLEMENTED

**Description:** Full editing capability for existing tickets.

**Implemented Editable Fields:**
- [x] Title (titulo)
- [x] Description (descricao)
- [x] Priority (prioridade)
- [x] Status (open, assigned, resolved, closed)
- [x] Related client (clienteId)
- [x] Related distributor (distribuidoraId)
- [x] Related order (pedidoId)
- [x] Tags

**Implemented Features:**
- [x] Edit button on ticket detail page
- [x] Dedicated edit page (/tickets/[id]/editar)
- [x] Pre-populated form with existing ticket data
- [x] API endpoint for updating tickets (PUT /api/tickets/[id])
- [x] Success/error feedback messages
- [x] Redirect to ticket detail after save

**Pending Features:**
- [ ] Assigned owners
- [ ] Edit history/audit log (who changed what, when)
- [ ] Validation on status transitions
- [ ] Confirm dialog for significant changes
- [ ] Auto-save draft (future)

**Status Workflow:**
```
open → assigned → resolved → closed
  ↓       ↓          ↓
  └───────┴──────────┴──→ (can reopen to 'open')
```

---

### 5. Alerts & Notifications

**Priority:** High
**Description:** Proactive notifications when ticket status changes or requires attention.

**Trigger Events:**
- [ ] Ticket assigned to you
- [ ] Ticket you own changes status
- [ ] Ticket you created changes status
- [ ] New comment on ticket you own/created
- [ ] @mention in a comment
- [ ] SLA breach warning (approaching deadline)
- [ ] SLA breach alert (deadline passed)

**Notification Channels:**

| Channel | Phase 1 | Phase 2 |
|---------|---------|---------|
| In-app notifications | Yes | Yes |
| Browser push notifications | No | Yes |
| Email notifications | No | Yes |
| WhatsApp/SMS | No | Future |

**In-App Notification Requirements:**
- [ ] Notification bell icon in header
- [ ] Unread count badge
- [ ] Notification dropdown/panel
- [ ] Mark as read/unread
- [ ] Mark all as read
- [ ] Click to navigate to ticket
- [ ] Notification preferences per user

---

### 6. Multiple Owners & Creator Assignment

**Priority:** Critical
**Description:** Support for ticket creator designation and multiple assigned owners.

**Creator (Criador):**
- [ ] Auto-set to user who creates the ticket
- [ ] Can be reassigned (for tickets created on behalf of someone)
- [ ] Creator always receives notifications about their ticket
- [ ] Creator visible on ticket detail page

**Owners (Responsáveis):**
- [ ] Support multiple owners per ticket (not just one)
- [ ] Primary owner designation (optional)
- [ ] All owners receive notifications
- [ ] Owner assignment triggers notification
- [ ] Removal from owners triggers notification
- [ ] Filter tickets by "My tickets" (where I'm an owner)
- [ ] Workload visibility (tickets per owner)

**Assignment Features:**
- [ ] Assign on ticket creation
- [ ] Assign/reassign on ticket edit
- [ ] Quick-assign from ticket list (future)
- [ ] Assignment history in audit log

**Data Model Update:**
```typescript
interface Ticket {
  // ... existing fields
  criadorId: string;
  criadorNome: string;
  owners: TicketOwner[];  // Changed from single owner
}

interface TicketOwner {
  userId: string;
  userName: string;
  isPrimary: boolean;
  assignedAt: string;
  assignedBy: string;
}
```

---

### 7. Tags System

**Priority:** High
**Status:** IMPLEMENTED

**Description:** Custom labels (short text) to help organize and categorize tickets. Tags are reusable across all tickets.

**Implemented Features:**
- [x] Add tags to tickets during creation
- [x] Select from existing tags (dropdown with search)
- [x] Create new tags inline (type and press Enter)
- [x] Remove tags from a ticket
- [x] Tags displayed as colored badges
- [x] Auto-assigned colors for new tags
- [x] Case-insensitive duplicate prevention

**Data Model:**
```typescript
interface TicketTag {
  id: string;
  nome: string;
  cor: string; // Tailwind color class (e.g., 'bg-blue-100 text-blue-800')
}

interface Ticket {
  // ... existing fields
  tags: TicketTag[];
}
```

**Available Tag Colors:**
- Blue, Green, Yellow, Purple, Pink, Indigo, Orange, Teal, Red

**Default Tags (pre-populated):**
- Entrega, Financeiro, Suporte Técnico, Cadastro, Produto, Reembolso, Urgente, Garantia

**Future Enhancements:**
- [ ] Edit tag name/color
- [ ] Delete unused tags
- [ ] Filter tickets by tag
- [ ] Tag usage statistics
- [ ] Tag management admin page

---

## Implementation Phases

### Phase 1 - Core Functionality (MVP)
1. ~~Tags system~~ (DONE)
2. ~~Edit tickets (all fields)~~ (DONE)
3. Single owner assignment (upgrade to multiple in Phase 2)
4. Basic comments (text only)
5. Simple in-app notifications
6. Basic dashboard (4-5 key metrics)

### Phase 2 - Enhanced Features
1. Multiple owners
2. File attachments (images, videos)
3. Rich text comments with @mentions
4. File attachments on comments
5. Full dashboard with charts
6. Notification preferences

### Phase 3 - Advanced Features
1. Email notifications
2. SLA tracking and alerts
3. Browser push notifications
4. Advanced reporting/export
5. Audit log viewer

---

## Open Questions

1. **File storage solution** - Which cloud storage provider?
2. **File size limits** - What are reasonable limits?
3. **SLA targets** - What are the response/resolution time goals?
4. **Notification frequency** - Immediate vs. batched digest?
5. **User roles** - Should some users have admin-only capabilities?

---

## Technical Dependencies

- [ ] Backend API development for all new endpoints
- [ ] File storage service setup
- [ ] WebSocket or polling for real-time notifications
- [ ] Database schema updates for owners, comments, attachments
- [ ] User management system (for owner selection)

---

## Next Steps

| Action | Owner | Due Date |
|--------|-------|----------|
| Review and approve this document | Team | |
| Define SLA targets | CS Operations | |
| Choose file storage solution | Tech | |
| Create database schema updates | Tech | |
| Begin Phase 1 development | Tech | |

---

*Document created from team discussion on 2026-01-12*
