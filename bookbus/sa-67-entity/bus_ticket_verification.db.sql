BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "members" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"username"	text NOT NULL,
	"password"	text NOT NULL,
	"email"	text NOT NULL,
	"first_name"	text NOT NULL,
	"last_name"	text NOT NULL,
	"birthday"	text NOT NULL,
	CONSTRAINT "uni_members_username" UNIQUE("username"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "buses" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"bus_number"	text NOT NULL,
	"bus_type"	text NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "seats" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"bus_id"	integer,
	"seat_number"	text NOT NULL,
	CONSTRAINT "fk_buses_seats" FOREIGN KEY("bus_id") REFERENCES "buses"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "routes" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"start_location"	text NOT NULL,
	"end_location"	text NOT NULL,
	"distance"	integer NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "schedules" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"route_id"	integer,
	"bus_id"	integer,
	"departure_time"	text NOT NULL,
	"arrival_time"	text NOT NULL,
	CONSTRAINT "fk_routes_schedules" FOREIGN KEY("route_id") REFERENCES "routes"("id"),
	CONSTRAINT "fk_buses_schedules" FOREIGN KEY("bus_id") REFERENCES "buses"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "tickets" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"member_id"	integer,
	"seat_id"	integer,
	"schedule_id"	integer,
	"issue_date"	text NOT NULL,
	"status"	text NOT NULL,
	CONSTRAINT "fk_members_tickets" FOREIGN KEY("member_id") REFERENCES "members"("id"),
	CONSTRAINT "fk_schedules_tickets" FOREIGN KEY("schedule_id") REFERENCES "schedules"("id"),
	CONSTRAINT "fk_seats_tickets" FOREIGN KEY("seat_id") REFERENCES "seats"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "employees" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"username"	text NOT NULL,
	"password"	text NOT NULL,
	"first_name"	text NOT NULL,
	"last_name"	text NOT NULL,
	CONSTRAINT "uni_employees_username" UNIQUE("username"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "ticket_verifications" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"ticket_id"	integer,
	"employee_id"	integer,
	"verification_time"	text NOT NULL,
	"status"	text NOT NULL,
	CONSTRAINT "fk_employees_ticket_verifications" FOREIGN KEY("employee_id") REFERENCES "employees"("id"),
	CONSTRAINT "fk_ticket_verifications_ticket" FOREIGN KEY("ticket_id") REFERENCES "tickets"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "passengers" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"member_id"	integer,
	"ticket_id"	integer,
	CONSTRAINT "fk_passengers_ticket" FOREIGN KEY("ticket_id") REFERENCES "tickets"("id"),
	CONSTRAINT "fk_members_passengers" FOREIGN KEY("member_id") REFERENCES "members"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE INDEX IF NOT EXISTS "idx_members_deleted_at" ON "members" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_buses_deleted_at" ON "buses" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_seats_deleted_at" ON "seats" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_routes_deleted_at" ON "routes" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_schedules_deleted_at" ON "schedules" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_tickets_deleted_at" ON "tickets" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_employees_deleted_at" ON "employees" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_ticket_verifications_deleted_at" ON "ticket_verifications" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_passengers_deleted_at" ON "passengers" (
	"deleted_at"
);
COMMIT;
