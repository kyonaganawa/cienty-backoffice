# Ticket System Database Model Plan

This document outlines the database schema design for the ticket system, providing both SQL (relational) and NoSQL (document-based) approaches.

---

## Data Entities Overview

| Entity | Description |
|--------|-------------|
| **Ticket** | Main support ticket entity |
| **TicketTag** | Reusable tags for categorizing tickets |
| **TicketComment** | Comments/replies on tickets |
| **TicketAttachment** | File attachments on tickets |
| **Client** | External client reference |
| **Distribuidora** | Distributor reference |
| **Pedido** | Order reference |

---

## SQL Schema (PostgreSQL)

### Tables

```sql
-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE ticket_status AS ENUM ('open', 'assigned', 'resolved', 'closed');
CREATE TYPE ticket_prioridade AS ENUM ('baixa', 'media', 'alta', 'urgente');
CREATE TYPE attachment_type AS ENUM ('image', 'pdf', 'video', 'document');

-- ============================================
-- CORE TABLES
-- ============================================

-- Tags (reusable across tickets)
CREATE TABLE ticket_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    cor VARCHAR(100) NOT NULL, -- Tailwind color class
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Main Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(500) NOT NULL,
    descricao TEXT NOT NULL,

    -- Client reference
    cliente_id UUID NOT NULL,
    cliente_nome VARCHAR(255) NOT NULL, -- Denormalized for performance

    -- Creator (admin who created the ticket)
    criador_id UUID NOT NULL REFERENCES admin_users(id),

    -- Optional references
    distribuidora_id UUID,
    distribuidora_nome VARCHAR(255), -- Denormalized
    pedido_id UUID,
    pedido_numero VARCHAR(50), -- Denormalized

    -- Status and priority
    status ticket_status NOT NULL DEFAULT 'open',
    prioridade ticket_prioridade NOT NULL DEFAULT 'media',

    -- Timestamps
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Indexes for common queries
    CONSTRAINT fk_criador FOREIGN KEY (criador_id) REFERENCES admin_users(id)
);

-- Ticket Owners (many-to-many: tickets <-> admin_users)
CREATE TABLE ticket_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(ticket_id, admin_user_id)
);

-- Ticket Tags junction table (many-to-many: tickets <-> tags)
CREATE TABLE ticket_tag_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES ticket_tags(id) ON DELETE CASCADE,

    UNIQUE(ticket_id, tag_id)
);

-- Ticket Comments
CREATE TABLE ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    content TEXT NOT NULL,

    -- Author (admin user)
    author_id UUID NOT NULL REFERENCES admin_users(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ticket Attachments
CREATE TABLE ticket_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,

    filename VARCHAR(500) NOT NULL,
    url TEXT NOT NULL, -- S3 URL
    type attachment_type NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,

    -- Uploader
    uploaded_by_id UUID NOT NULL REFERENCES admin_users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Tickets indexes
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_prioridade ON tickets(prioridade);
CREATE INDEX idx_tickets_cliente_id ON tickets(cliente_id);
CREATE INDEX idx_tickets_criador_id ON tickets(criador_id);
CREATE INDEX idx_tickets_distribuidora_id ON tickets(distribuidora_id);
CREATE INDEX idx_tickets_pedido_id ON tickets(pedido_id);
CREATE INDEX idx_tickets_data_criacao ON tickets(data_criacao DESC);
CREATE INDEX idx_tickets_data_atualizacao ON tickets(data_atualizacao DESC);

-- Composite index for common filtering
CREATE INDEX idx_tickets_status_prioridade ON tickets(status, prioridade);

-- Full-text search on title and description
CREATE INDEX idx_tickets_search ON tickets USING GIN (
    to_tsvector('portuguese', titulo || ' ' || descricao)
);

-- Ticket owners indexes
CREATE INDEX idx_ticket_owners_ticket_id ON ticket_owners(ticket_id);
CREATE INDEX idx_ticket_owners_admin_user_id ON ticket_owners(admin_user_id);

-- Comments indexes
CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX idx_ticket_comments_created_at ON ticket_comments(created_at DESC);

-- Attachments indexes
CREATE INDEX idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update data_atualizacao on ticket changes
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ticket_timestamp
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_ticket_timestamp();

-- Auto-update ticket status when owners are assigned
CREATE OR REPLACE FUNCTION update_ticket_status_on_assign()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tickets
    SET status = 'assigned', data_atualizacao = CURRENT_TIMESTAMP
    WHERE id = NEW.ticket_id AND status = 'open';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_status_on_assign
    AFTER INSERT ON ticket_owners
    FOR EACH ROW
    EXECUTE FUNCTION update_ticket_status_on_assign();

-- ============================================
-- VIEWS
-- ============================================

-- Ticket summary view with counts
CREATE VIEW ticket_stats AS
SELECT
    status,
    prioridade,
    COUNT(*) as count
FROM tickets
GROUP BY status, prioridade;

-- Full ticket view with aggregated data
CREATE VIEW tickets_full AS
SELECT
    t.*,
    au.nome as criador_nome,
    au.email as criador_email,
    (
        SELECT json_agg(json_build_object(
            'id', o.id,
            'nome', o.nome,
            'email', o.email
        ))
        FROM admin_users o
        JOIN ticket_owners tow ON tow.admin_user_id = o.id
        WHERE tow.ticket_id = t.id
    ) as owners,
    (
        SELECT json_agg(json_build_object(
            'id', tg.id,
            'nome', tg.nome,
            'cor', tg.cor
        ))
        FROM ticket_tags tg
        JOIN ticket_tag_assignments tta ON tta.tag_id = tg.id
        WHERE tta.ticket_id = t.id
    ) as tags,
    (SELECT COUNT(*) FROM ticket_comments tc WHERE tc.ticket_id = t.id) as comment_count,
    (SELECT COUNT(*) FROM ticket_attachments ta WHERE ta.ticket_id = t.id) as attachment_count
FROM tickets t
JOIN admin_users au ON au.id = t.criador_id;
```

---

## NoSQL Schema (MongoDB)

### Collections

#### `tickets` Collection

```javascript
// Main ticket document structure
{
  _id: ObjectId("..."),
  titulo: "Problema com entrega do pedido",
  descricao: "Cliente reportou que o pedido não foi entregue...",

  // Client reference (denormalized)
  cliente: {
    id: ObjectId("..."),
    nome: "João Silva"
  },

  // Creator (admin who created)
  criador: {
    id: ObjectId("..."),
    nome: "Admin User",
    email: "admin@backoffice.com"
  },

  // Assigned owners (embedded array)
  owners: [
    {
      id: ObjectId("..."),
      nome: "Maria Silva",
      email: "maria.silva@backoffice.com",
      assignedAt: ISODate("2024-10-21T10:00:00Z")
    }
  ],

  // Optional references (denormalized)
  distribuidora: {
    id: ObjectId("..."),
    nome: "Distribuidora Nacional S.A."
  },

  pedido: {
    id: ObjectId("..."),
    numero: "PED-2024-003"
  },

  // Status and priority
  status: "assigned", // "open" | "assigned" | "resolved" | "closed"
  prioridade: "alta", // "baixa" | "media" | "alta" | "urgente"

  // Tags (embedded for fast reads)
  tags: [
    {
      id: ObjectId("..."),
      nome: "Entrega",
      cor: "bg-blue-100 text-blue-800"
    },
    {
      id: ObjectId("..."),
      nome: "Urgente",
      cor: "bg-red-100 text-red-800"
    }
  ],

  // Attachments (embedded)
  attachments: [
    {
      id: ObjectId("..."),
      filename: "screenshot.png",
      url: "https://s3.amazonaws.com/bucket/...",
      type: "image", // "image" | "pdf" | "video" | "document"
      mimeType: "image/png",
      sizeBytes: 245000,
      uploadedAt: ISODate("2024-10-22T14:30:00Z"),
      uploadedBy: {
        id: ObjectId("..."),
        nome: "Admin User",
        email: "admin@backoffice.com"
      }
    }
  ],

  // Comments (embedded for small/medium ticket activity)
  // For high-volume tickets, consider separate collection
  comments: [
    {
      id: ObjectId("..."),
      content: "Entrando em contato com a distribuidora...",
      author: {
        id: ObjectId("..."),
        nome: "Maria Silva",
        email: "maria.silva@backoffice.com"
      },
      createdAt: ISODate("2024-10-22T15:00:00Z")
    }
  ],

  // Counts for quick access
  commentCount: 1,
  attachmentCount: 1,

  // Timestamps
  dataCriacao: ISODate("2024-10-22T10:00:00Z"),
  dataAtualizacao: ISODate("2024-10-22T15:00:00Z")
}
```

#### `ticket_tags` Collection (Master tag list)

```javascript
{
  _id: ObjectId("..."),
  nome: "Entrega",
  cor: "bg-blue-100 text-blue-800",
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  usageCount: 45 // Optional: track how many tickets use this tag
}
```

#### `admin_users` Collection

```javascript
{
  _id: ObjectId("..."),
  nome: "Maria Silva",
  email: "maria.silva@backoffice.com",
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-10-01T00:00:00Z")
}
```

### Indexes

```javascript
// tickets collection indexes
db.tickets.createIndex({ status: 1 });
db.tickets.createIndex({ prioridade: 1 });
db.tickets.createIndex({ "cliente.id": 1 });
db.tickets.createIndex({ "criador.id": 1 });
db.tickets.createIndex({ "owners.id": 1 });
db.tickets.createIndex({ "distribuidora.id": 1 });
db.tickets.createIndex({ "pedido.id": 1 });
db.tickets.createIndex({ "tags.id": 1 });
db.tickets.createIndex({ dataCriacao: -1 });
db.tickets.createIndex({ dataAtualizacao: -1 });

// Compound indexes for common queries
db.tickets.createIndex({ status: 1, prioridade: 1 });
db.tickets.createIndex({ status: 1, dataCriacao: -1 });

// Text search index
db.tickets.createIndex(
  { titulo: "text", descricao: "text" },
  { default_language: "portuguese" }
);

// ticket_tags collection
db.ticket_tags.createIndex({ nome: 1 }, { unique: true });
```

### Alternative: Separate Comments Collection (for high-volume)

```javascript
// ticket_comments collection (if comments become large)
{
  _id: ObjectId("..."),
  ticketId: ObjectId("..."),
  content: "Entrando em contato com a distribuidora...",
  author: {
    id: ObjectId("..."),
    nome: "Maria Silva",
    email: "maria.silva@backoffice.com"
  },
  createdAt: ISODate("2024-10-22T15:00:00Z"),
  updatedAt: ISODate("2024-10-22T15:00:00Z")
}

// Index
db.ticket_comments.createIndex({ ticketId: 1, createdAt: -1 });
```

---

## Comparison: SQL vs NoSQL

| Aspect | SQL (PostgreSQL) | NoSQL (MongoDB) |
|--------|------------------|-----------------|
| **Data Integrity** | Strong FK constraints | Application-level validation |
| **Query Flexibility** | Complex JOINs possible | Aggregation pipeline |
| **Read Performance** | Requires JOINs | Fast (embedded data) |
| **Write Performance** | Normalized, multiple inserts | Single document update |
| **Scalability** | Vertical (+ read replicas) | Horizontal sharding |
| **Schema Changes** | Migrations required | Flexible schema |
| **Transactions** | Full ACID | ACID within documents |
| **Full-text Search** | Built-in (GIN index) | Built-in (text index) |

### Recommendations

**Choose SQL (PostgreSQL) if:**
- Strong data integrity is critical
- Complex reporting/analytics needed
- Existing SQL infrastructure
- Need for complex JOINs across entities

**Choose NoSQL (MongoDB) if:**
- High read throughput needed
- Schema may evolve frequently
- Embedded data pattern fits well (comments, attachments)
- Horizontal scaling is a priority

---

## Common Queries

### SQL Examples

```sql
-- Get all open tickets with high priority
SELECT * FROM tickets_full
WHERE status = 'open' AND prioridade IN ('alta', 'urgente')
ORDER BY data_criacao DESC;

-- Get tickets assigned to a specific admin
SELECT t.* FROM tickets t
JOIN ticket_owners tow ON tow.ticket_id = t.id
WHERE tow.admin_user_id = 'uuid-here';

-- Get ticket stats by status
SELECT status, COUNT(*) as count
FROM tickets
GROUP BY status;

-- Full-text search
SELECT * FROM tickets
WHERE to_tsvector('portuguese', titulo || ' ' || descricao)
      @@ plainto_tsquery('portuguese', 'entrega problema');
```

### MongoDB Examples

```javascript
// Get all open tickets with high priority
db.tickets.find({
  status: "open",
  prioridade: { $in: ["alta", "urgente"] }
}).sort({ dataCriacao: -1 });

// Get tickets assigned to a specific admin
db.tickets.find({
  "owners.id": ObjectId("...")
});

// Get ticket stats by status
db.tickets.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);

// Full-text search
db.tickets.find({
  $text: { $search: "entrega problema" }
});
```

---

## Migration Considerations

When migrating from mock data to a real database:

1. **Generate UUIDs** - Replace string IDs with proper UUIDs/ObjectIds
2. **Normalize admin users** - Extract to separate table/collection
3. **Establish foreign keys** - Link to actual clients, orders, distributors
4. **Set up triggers** - Auto-update timestamps, status changes
5. **Create indexes** - Based on query patterns
6. **Implement soft deletes** - Add `deleted_at` field if needed
