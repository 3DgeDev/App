import * as SQLite from "expo-sqlite";

let db = null;

export async function initDb() {
  db = await SQLite.openDatabaseAsync("votes_v2.db");

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      role TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidateId INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}

export async function getCandidatesByRole(role) {
  return await db.getAllAsync(
    `SELECT * FROM candidates WHERE role = ? ORDER BY id DESC;`,
    [role]
  );
}

export async function addCandidate({ name, imageUri, role }) {
  const createdAt = new Date().toISOString();
  const finalRole = role || "GENERAL";

  await db.runAsync(
    `INSERT INTO candidates (name, imageUri, role, createdAt)
     VALUES (?, ?, ?, ?);`,
    [name.trim(), imageUri.trim(), finalRole, createdAt]
  );
}

export async function addVote(candidateId) {
  const createdAt = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO votes (candidateId, createdAt) VALUES (?, ?);`,
    [candidateId, createdAt]
  );
}

export async function getVoteStats() {
  return await db.getAllAsync(`
    SELECT 
      c.id,
      c.name,
      c.imageUri,
      c.role,
      COUNT(v.id) as votes
    FROM candidates c
    LEFT JOIN votes v ON v.candidateId = c.id
    GROUP BY c.id
    ORDER BY votes DESC, c.id DESC;
  `);
}

export async function getTotalVotes() {
  const row = await db.getFirstAsync(`SELECT COUNT(*) as total FROM votes;`);
  return row?.total ?? 0;
}

export async function resetVotes() {
  await db.runAsync(`DELETE FROM votes;`);
}

export async function resetAll() {
  await db.runAsync(`DELETE FROM votes;`);
  await db.runAsync(`DELETE FROM candidates;`);
}