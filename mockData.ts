import type {
  AbsenceNotice, DriverProfile, Expense, MaintenanceItem, Notice,
  Payment, Rating, Student, VehicleDocument, WaitlistEntry,
} from "../types";

// Fictional demo data, wired consistently across screens (same students,
// same three months) so every dashboard number traces back to this single
// source of truth instead of being hand-typed per screen.

export const driverProfile: DriverProfile = {
  name: "José Oliveira",
  phone: "5511998887766",
  vehicleModel: "Toyota HiAce",
  plate: "AYG-4512",
  capacity: 15,
  odometerKm: 73320,
  city: "São Paulo",
  pixKey: "+5511998887766",
};

export const students: Student[] = [
  { id: 1, name: "Ana Carolina Lima", avatar: "AC", guardianName: "Marta Lima", phone: "5511987650001", email: "marta.lima@email.com", pickupAddress: "Rua das Flores, 142 — Jardim Europa", dropoffAddress: "Colégio Anglo — Unidade Centro", pickupTime: "06:40", dropoffTime: "07:15", school: "Colégio Anglo", shift: "matutino", planValue: 320, dueDay: 5, preferredMethod: "pix", status: "ativo", joinedAt: "2025-02-03", documents: [{ id: 1, name: "RG do responsável", fileName: "rg_marta_lima.pdf", uploadedAt: "2025-02-03" }, { id: 2, name: "Contrato assinado", fileName: "contrato_ana_2025.pdf", uploadedAt: "2025-02-03" }] },
  { id: 2, name: "Bruno Ferreira", avatar: "BF", guardianName: "Roberto Ferreira", phone: "5511987650002", pickupAddress: "Av. Brasil, 880 — Centro", dropoffAddress: "Colégio Anglo — Unidade Centro", pickupTime: "06:45", dropoffTime: "07:15", school: "Colégio Anglo", shift: "matutino", planValue: 320, dueDay: 5, preferredMethod: "pix", status: "ativo", joinedAt: "2025-02-10", documents: [{ id: 3, name: "Contrato assinado", fileName: "contrato_bruno_2025.pdf", uploadedAt: "2025-02-10" }] },
  { id: 3, name: "Camila Souza", avatar: "CS", guardianName: "Cristina Souza", phone: "5511987650003", pickupAddress: "R. Dom Pedro, 55 — Vila Nova", dropoffAddress: "Objetivo Integrado", pickupTime: "06:50", dropoffTime: "07:25", school: "Objetivo Integrado", shift: "matutino", planValue: 300, dueDay: 10, preferredMethod: "pix", status: "ativo", joinedAt: "2025-02-03", documents: [{ id: 4, name: "Contrato assinado", fileName: "contrato_camila_2025.pdf", uploadedAt: "2025-02-03" }] },
  { id: 4, name: "Diego Martins", avatar: "DM", guardianName: "Paulo Martins", phone: "5511987650004", pickupAddress: "Av. Paulista, 1200 — Bela Vista", dropoffAddress: "Objetivo Integrado", pickupTime: "06:55", dropoffTime: "07:25", school: "Objetivo Integrado", shift: "matutino", planValue: 300, dueDay: 10, preferredMethod: "cartao", status: "ativo", joinedAt: "2025-08-12", documents: [{ id: 5, name: "Contrato assinado", fileName: "contrato_diego_2025.pdf", uploadedAt: "2025-08-12" }] },
  { id: 5, name: "Elena Rocha", avatar: "ER", guardianName: "Luciana Rocha", phone: "5511987650005", pickupAddress: "R. XV de Novembro, 300 — Centro", dropoffAddress: "Escola Estadual Rui Barbosa", pickupTime: "12:20", dropoffTime: "13:00", school: "Escola Estadual Rui Barbosa", shift: "vespertino", planValue: 350, dueDay: 15, preferredMethod: "transferencia", status: "ativo", joinedAt: "2024-11-20", documents: [{ id: 6, name: "Contrato assinado", fileName: "contrato_elena_2024.pdf", uploadedAt: "2024-11-20" }] },
  { id: 6, name: "Felipe Nunes", avatar: "FN", guardianName: "Marcos Nunes", phone: "5511987650006", pickupAddress: "R. Marechal Rondon, 88 — Boa Vista", dropoffAddress: "Escola Estadual Rui Barbosa", pickupTime: "12:25", dropoffTime: "13:00", school: "Escola Estadual Rui Barbosa", shift: "vespertino", planValue: 350, dueDay: 20, preferredMethod: "pix", status: "ativo", joinedAt: "2025-01-15", documents: [{ id: 7, name: "Contrato assinado", fileName: "contrato_felipe_2025.pdf", uploadedAt: "2025-01-15" }] },
  { id: 7, name: "Gabriela Torres", avatar: "GT", guardianName: "Fernanda Torres", phone: "5511987650007", pickupAddress: "R. Sete de Setembro, 210 — Jardim América", dropoffAddress: "Colégio Anglo — Unidade Centro", pickupTime: "12:15", dropoffTime: "12:50", school: "Colégio Anglo", shift: "vespertino", planValue: 350, dueDay: 25, preferredMethod: "dinheiro", status: "ativo", joinedAt: "2025-03-01", documents: [{ id: 8, name: "Contrato assinado", fileName: "contrato_gabriela_2025.pdf", uploadedAt: "2025-03-01" }] },
  { id: 8, name: "Henrique Alves", avatar: "HA", guardianName: "Sílvio Alves", phone: "5511987650008", pickupAddress: "Av. Independência, 640 — Vila Rica", dropoffAddress: "Objetivo Integrado", pickupTime: "07:00", dropoffTime: "07:30", school: "Objetivo Integrado", shift: "integral", planValue: 380, dueDay: 28, preferredMethod: "pix", status: "ativo", joinedAt: "2025-02-17", documents: [{ id: 9, name: "Contrato assinado", fileName: "contrato_henrique_2025.pdf", uploadedAt: "2025-02-17" }] },
];

export const payments: Payment[] = [
  // Junho 2026 (fechado — todos pagos, alguns atrasados)
  { id: 101, studentId: 1, referenceMonth: "2026-06", amount: 320, dueDate: "2026-06-05", paidDate: "2026-06-05", status: "pago", method: "pix" },
  { id: 102, studentId: 2, referenceMonth: "2026-06", amount: 320, dueDate: "2026-06-05", paidDate: "2026-06-09", status: "pago", method: "pix" },
  { id: 103, studentId: 3, referenceMonth: "2026-06", amount: 300, dueDate: "2026-06-10", paidDate: "2026-06-10", status: "pago", method: "pix" },
  { id: 104, studentId: 4, referenceMonth: "2026-06", amount: 300, dueDate: "2026-06-10", paidDate: "2026-06-10", status: "pago", method: "pix" },
  { id: 105, studentId: 5, referenceMonth: "2026-06", amount: 350, dueDate: "2026-06-15", paidDate: "2026-06-16", status: "pago", method: "transferencia" },
  { id: 106, studentId: 6, referenceMonth: "2026-06", amount: 350, dueDate: "2026-06-20", paidDate: "2026-06-19", status: "pago", method: "pix" },
  { id: 107, studentId: 7, referenceMonth: "2026-06", amount: 350, dueDate: "2026-06-25", paidDate: "2026-06-24", status: "pago", method: "dinheiro" },
  { id: 108, studentId: 8, referenceMonth: "2026-06", amount: 380, dueDate: "2026-06-28", paidDate: "2026-06-30", status: "pago", method: "pix" },
  // Julho 2026 (fechado)
  { id: 201, studentId: 1, referenceMonth: "2026-07", amount: 320, dueDate: "2026-07-05", paidDate: "2026-07-05", status: "pago", method: "pix" },
  { id: 202, studentId: 2, referenceMonth: "2026-07", amount: 320, dueDate: "2026-07-05", paidDate: "2026-07-12", status: "pago", method: "pix" },
  { id: 203, studentId: 3, referenceMonth: "2026-07", amount: 300, dueDate: "2026-07-10", paidDate: "2026-07-10", status: "pago", method: "pix" },
  { id: 204, studentId: 4, referenceMonth: "2026-07", amount: 300, dueDate: "2026-07-10", paidDate: "2026-07-11", status: "pago", method: "cartao" },
  { id: 205, studentId: 5, referenceMonth: "2026-07", amount: 350, dueDate: "2026-07-15", paidDate: "2026-07-15", status: "pago", method: "transferencia" },
  { id: 206, studentId: 6, referenceMonth: "2026-07", amount: 350, dueDate: "2026-07-20", paidDate: "2026-07-21", status: "pago", method: "pix" },
  { id: 207, studentId: 7, referenceMonth: "2026-07", amount: 350, dueDate: "2026-07-25", paidDate: "2026-07-25", status: "pago", method: "dinheiro" },
  { id: 208, studentId: 8, referenceMonth: "2026-07", amount: 380, dueDate: "2026-07-28", paidDate: "2026-07-29", status: "pago", method: "pix" },
  // Agosto 2026 — mês em andamento (hoje = 20/08): 3 pagos, 2 atrasados, 3 pendentes
  { id: 301, studentId: 1, referenceMonth: "2026-08", amount: 320, dueDate: "2026-08-05", paidDate: "2026-08-04", status: "pago", method: "pix" },
  { id: 302, studentId: 2, referenceMonth: "2026-08", amount: 320, dueDate: "2026-08-05", status: "atrasado" },
  { id: 303, studentId: 3, referenceMonth: "2026-08", amount: 300, dueDate: "2026-08-10", paidDate: "2026-08-09", status: "pago", method: "pix" },
  { id: 304, studentId: 4, referenceMonth: "2026-08", amount: 300, dueDate: "2026-08-10", status: "atrasado" },
  { id: 305, studentId: 5, referenceMonth: "2026-08", amount: 350, dueDate: "2026-08-15", paidDate: "2026-08-14", status: "pago", method: "transferencia" },
  { id: 306, studentId: 6, referenceMonth: "2026-08", amount: 350, dueDate: "2026-08-20", status: "pendente" },
  { id: 307, studentId: 7, referenceMonth: "2026-08", amount: 350, dueDate: "2026-08-25", status: "pendente" },
  { id: 308, studentId: 8, referenceMonth: "2026-08", amount: 380, dueDate: "2026-08-28", status: "pendente" },
];

export const expenses: Expense[] = [
  { id: 1001, category: "combustivel", description: "Abastecimento — Posto Ipiranga BR-116", amount: 232, date: "2026-06-02", odometerKm: 68420, liters: 37.4 },
  { id: 1002, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 46.8, date: "2026-06-03" },
  { id: 1003, category: "limpeza", description: "Lavagem completa + higienização dos bancos", amount: 70, date: "2026-06-07" },
  { id: 1004, category: "combustivel", description: "Abastecimento — Posto Shell Marginal", amount: 248, date: "2026-06-08", odometerKm: 68790, liters: 39.9 },
  { id: 1005, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 38.5, date: "2026-06-09" },
  { id: 1006, category: "seguro", description: "Parcela do seguro APP (6/12)", amount: 189.9, date: "2026-06-05" },
  { id: 1007, category: "ipva", description: "IPVA 2026 — última parcela (3/3)", amount: 540, date: "2026-06-10" },
  { id: 1008, category: "manutencao", description: "Troca de óleo, filtro de óleo e filtro de ar", amount: 420, date: "2026-06-13", odometerKm: 69000 },
  { id: 1009, category: "combustivel", description: "Abastecimento — Posto Ipiranga BR-116", amount: 219, date: "2026-06-14", odometerKm: 69120, liters: 35.2 },
  { id: 1010, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 52.3, date: "2026-06-17" },
  { id: 1011, category: "combustivel", description: "Abastecimento — Posto Shell Marginal", amount: 255, date: "2026-06-20", odometerKm: 69480, liters: 41 },
  { id: 1012, category: "limpeza", description: "Lavagem completa + higienização dos bancos", amount: 70, date: "2026-06-21" },
  { id: 1013, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 41, date: "2026-06-24" },
  { id: 1014, category: "combustivel", description: "Abastecimento — Posto Ipiranga BR-116", amount: 241, date: "2026-06-26", odometerKm: 69810, liters: 38.8 },
  { id: 1101, category: "combustivel", description: "Abastecimento — Posto Ipiranga BR-116", amount: 236, date: "2026-07-01", odometerKm: 70150, liters: 38.1 },
  { id: 1102, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 44.2, date: "2026-07-02" },
  { id: 1103, category: "seguro", description: "Parcela do seguro APP (7/12)", amount: 189.9, date: "2026-07-05" },
  { id: 1104, category: "combustivel", description: "Abastecimento — Posto Shell Marginal", amount: 251, date: "2026-07-06", odometerKm: 70510, liters: 40.5 },
  { id: 1105, category: "limpeza", description: "Lavagem completa + higienização dos bancos", amount: 70, date: "2026-07-06" },
  { id: 1106, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 39.9, date: "2026-07-10" },
  { id: 1107, category: "combustivel", description: "Abastecimento — Posto Ipiranga BR-116", amount: 228, date: "2026-07-11", odometerKm: 70850, liters: 36.8 },
  { id: 1108, category: "manutencao", description: "Pastilhas e discos de freio dianteiros", amount: 680, date: "2026-07-15", odometerKm: 71000 },
  { id: 1109, category: "combustivel", description: "Abastecimento — Posto Shell Marginal", amount: 262, date: "2026-07-17", odometerKm: 71230, liters: 42.3 },
  { id: 1110, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 55.6, date: "2026-07-18" },
  { id: 1111, category: "limpeza", description: "Lavagem completa + higienização dos bancos", amount: 75, date: "2026-07-20" },
  { id: 1112, category: "combustivel", description: "Abastecimento — Posto Ipiranga BR-116", amount: 244, date: "2026-07-23", odometerKm: 71570, liters: 39.4 },
  { id: 1113, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 42.8, date: "2026-07-25" },
  { id: 1114, category: "combustivel", description: "Abastecimento — Posto Shell Marginal", amount: 233, date: "2026-07-29", odometerKm: 71900, liters: 37.6 },
  { id: 1201, category: "combustivel", description: "Abastecimento — Posto Ipiranga BR-116", amount: 239, date: "2026-08-01", odometerKm: 72040, liters: 38.5 },
  { id: 1202, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 41.5, date: "2026-08-03" },
  { id: 1203, category: "seguro", description: "Parcela do seguro APP (8/12)", amount: 189.9, date: "2026-08-05" },
  { id: 1204, category: "combustivel", description: "Abastecimento — Posto Shell Marginal", amount: 247, date: "2026-08-06", odometerKm: 72410, liters: 39.8 },
  { id: 1205, category: "limpeza", description: "Lavagem completa + higienização dos bancos", amount: 70, date: "2026-08-08" },
  { id: 1206, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 48.9, date: "2026-08-11" },
  { id: 1207, category: "combustivel", description: "Abastecimento — Posto Ipiranga BR-116", amount: 225, date: "2026-08-12", odometerKm: 72740, liters: 36.3 },
  { id: 1208, category: "manutencao", description: "Rodízio de pneus e alinhamento", amount: 260, date: "2026-08-14", odometerKm: 72900 },
  { id: 1209, category: "combustivel", description: "Abastecimento — Posto Shell Marginal", amount: 253, date: "2026-08-18", odometerKm: 73110, liters: 40.8 },
  { id: 1210, category: "pedagio", description: "Pedágio Rodovia dos Bandeirantes", amount: 39.6, date: "2026-08-19" },
];

export const vehicleDocuments: VehicleDocument[] = [
  { id: 1, name: "Seguro APP (Acidentes de Passageiros)", dueDate: "2026-09-01", renewalCost: 2278.8 },
  { id: 2, name: "Autorização Municipal de Transporte Escolar", dueDate: "2026-11-30" },
  { id: 3, name: "CRLV / Licenciamento anual", dueDate: "2027-01-15" },
];

export const maintenanceItems: MaintenanceItem[] = [
  { id: 1, name: "Troca de óleo e filtros", intervalKm: 8000, lastDoneDate: "2026-06-13", lastDoneKm: 69000 },
  { id: 2, name: "Pastilhas e discos de freio", intervalKm: 25000, lastDoneDate: "2026-07-15", lastDoneKm: 71000 },
  { id: 3, name: "Rodízio de pneus e alinhamento", intervalKm: 10000, lastDoneDate: "2026-08-14", lastDoneKm: 72900 },
  { id: 4, name: "Revisão geral (correias, fluidos)", intervalMonths: 12, lastDoneDate: "2025-09-10", lastDoneKm: 60500 },
];

export const absenceNotices: AbsenceNotice[] = [
  { id: 1, studentId: 1, date: "2026-08-21", note: "Consulta médica" },
  { id: 2, studentId: 4, date: "2026-08-20", note: "Viagem em família" },
];

export const notices: Notice[] = [
  { id: 1, title: "Troca de horário na sexta", message: "Sexta-feira (21/08) a van sai 10 min mais cedo por causa da reunião de pais. Chego às 6h30 na primeira parada.", audience: "todos", createdAt: "2026-08-19", pinned: true },
  { id: 2, title: "Van reserva esta semana", message: "Alunos do turno vespertino: nos dias 24 e 25/08 uma van reserva branca vai fazer a rota — mesmo motorista, placa BRC-9910.", audience: "vespertino", createdAt: "2026-08-18" },
];

export const ratings: Rating[] = [
  { id: 1, studentId: 1, score: 5, comment: "Sempre pontual e a van é muito limpa!", createdAt: "2026-07-30" },
  { id: 2, studentId: 3, score: 5, comment: "Motorista super atencioso com as crianças.", createdAt: "2026-07-28" },
  { id: 3, studentId: 6, score: 4, comment: "Só acho que às vezes atrasa uns minutos.", createdAt: "2026-07-15" },
];

export const waitlist: WaitlistEntry[] = [
  { id: 1, name: "Lucas Andrade", guardianName: "Patrícia Andrade", phone: "5511987650009", desiredShift: "matutino", requestedAt: "2026-08-10" },
  { id: 2, name: "Isabela Martins", guardianName: "Renata Martins", phone: "5511987650010", desiredShift: "vespertino", requestedAt: "2026-08-15" },
];

/** The demo's logged-in student persona for the Aluno-facing screens. */
export const currentStudentId = 1;
