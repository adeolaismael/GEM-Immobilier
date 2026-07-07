-- Migration : ajouter la colonne service aux messages contact
ALTER TABLE messages_contact ADD COLUMN IF NOT EXISTS service text;
