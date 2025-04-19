-- Inicialização do banco de dados para o Organizador de Agenda TDAH
-- Este arquivo cria as tabelas necessárias para armazenar as preferências do usuário,
-- configurações de lembretes e dados do modo viagem.

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  image TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Tabela de preferências do usuário
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  default_reminder_times TEXT NOT NULL DEFAULT '60,30,15,5', -- Tempos de lembrete padrão em minutos, separados por vírgula
  familiar_locations TEXT DEFAULT 'casa,trabalho,academia,escola', -- Localizações familiares separadas por vírgula
  travel_buffer_percentage INTEGER NOT NULL DEFAULT 50, -- Porcentagem adicional de tempo para deslocamentos em viagem
  categories_config TEXT, -- Configuração JSON das categorias personalizadas
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Tabela de modo viagem
CREATE TABLE IF NOT EXISTS travel_mode (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  locations TEXT, -- Localizações da viagem separadas por vírgula
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  UNIQUE(user_id)
);

-- Tabela de lembretes personalizados
CREATE TABLE IF NOT EXISTS event_reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  reminder_times TEXT NOT NULL, -- Tempos de lembrete em minutos, separados por vírgula
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  UNIQUE(user_id, event_id)
);

-- Tabela de checklists concluídos
CREATE TABLE IF NOT EXISTS completed_checklist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  item_text TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  UNIQUE(user_id, event_id, item_text)
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_mode_user_id ON travel_mode(user_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_user_id ON event_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_event_id ON event_reminders(event_id);
CREATE INDEX IF NOT EXISTS idx_completed_checklist_items_user_id ON completed_checklist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_checklist_items_event_id ON completed_checklist_items(event_id);

-- Inserir dados de exemplo (opcional, remover em produção)
INSERT OR IGNORE INTO users (id, email, name) 
VALUES ('example-user-id', 'usuario@exemplo.com', 'Usuário Exemplo');

INSERT OR IGNORE INTO user_preferences (user_id, default_reminder_times, familiar_locations) 
VALUES ('example-user-id', '60,30,15,5', 'casa,trabalho,academia,escola,São Paulo,SP,casa dos pais');

INSERT OR IGNORE INTO travel_mode (user_id, is_active, start_date, end_date) 
VALUES ('example-user-id', 0, NULL, NULL);
