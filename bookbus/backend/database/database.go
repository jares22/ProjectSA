package database

import (
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
    "log"
)

var db *sql.DB

func Init() {
    var err error
    db, err = sql.Open("sqlite3", "./backend.db")
    if err != nil {
        log.Fatal(err)
    }
}

func SeedData() {
    // เพิ่มข้อมูลตัวอย่าง
    _, err := db.Exec(`
        INSERT INTO buses (bus_number, capacity) VALUES ('B001', 50);
        INSERT INTO routes (start_station, end_station) VALUES ('Station A', 'Station B');
        INSERT INTO schedules (route_id, departure_time, arrival_time) VALUES (1, '08:00', '10:00');
        INSERT INTO employees (name) VALUES ('John Doe');
        INSERT INTO passengers (name) VALUES ('Alice Smith');
        INSERT INTO tickets (ticket_number, seat_number, status, bus_id, route_id, schedule_id, passenger_id) VALUES ('T001', 'A1', 'available', 1, 1, 1, 1);
        INSERT INTO ticket_verifications (ticket_id, employee_id, verification_time, status) VALUES (1, 1, '2024-07-21T12:00:00Z', 'verified');
    `)
    if err != nil {
        log.Fatal(err)
    }
}

func GetBuses() ([]Bus, error) {
    rows, err := db.Query(`SELECT id, bus_number, capacity FROM buses`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    buses := []Bus{}
    for rows.Next() {
        var bus Bus
        err := rows.Scan(&bus.ID, &bus.BusNumber, &bus.Capacity)
        if err != nil {
            return nil, err
        }
        buses = append(buses, bus)
    }
    return buses, nil
}

func GetRoutes() ([]Route, error) {
    rows, err := db.Query(`SELECT id, start_station, end_station FROM routes`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    routes := []Route{}
    for rows.Next() {
        var route Route
        err := rows.Scan(&route.ID, &route.StartStation, &route.EndStation)
        if err != nil {
            return nil, err
        }
        routes = append(routes, route)
    }
    return routes, nil
}

func GetSchedules() ([]Schedule, error) {
    rows, err := db.Query(`SELECT id, route_id, departure_time, arrival_time FROM schedules`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    schedules := []Schedule{}
    for rows.Next() {
        var schedule Schedule
        err := rows.Scan(&schedule.ID, &schedule.RouteID, &schedule.DepartureTime, &schedule.ArrivalTime)
        if err != nil {
            return nil, err
        }
        schedules = append(schedules, schedule)
    }
    return schedules, nil
}

func GetEmployees() ([]Employee, error) {
    rows, err := db.Query(`SELECT id, name FROM employees`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    employees := []Employee{}
    for rows.Next() {
        var employee Employee
        err := rows.Scan(&employee.ID, &employee.Name)
        if err != nil {
            return nil, err
        }
        employees = append(employees, employee)
    }
    return employees, nil
}

func GetPassengers() ([]Passenger, error) {
    rows, err := db.Query(`SELECT id, name FROM passengers`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    passengers := []Passenger{}
    for rows.Next() {
        var passenger Passenger
        err := rows.Scan(&passenger.ID, &passenger.Name)
        if err != nil {
            return nil, err
        }
        passengers = append(passengers, passenger)
    }
    return passengers, nil
}

func GetTickets() ([]Ticket, error) {
    rows, err := db.Query(`SELECT id, ticket_number, seat_number, status, bus_id, route_id, schedule_id, passenger_id FROM tickets`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    tickets := []Ticket{}
    for rows.Next() {
        var ticket Ticket
        err := rows.Scan(&ticket.ID, &ticket.TicketNumber, &ticket.SeatNumber, &ticket.Status, &ticket.BusID, &ticket.RouteID, &ticket.ScheduleID, &ticket.PassengerID)
        if err != nil {
            return nil, err
        }
        tickets = append(tickets, ticket)
    }
    return tickets, nil
}

func GetTicketVerifications() ([]TicketVerification, error) {
    rows, err := db.Query(`SELECT id, ticket_id, employee_id, verification_time, status FROM ticket_verifications`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    verifications := []TicketVerification{}
    for rows.Next() {
        var verification TicketVerification
        err := rows.Scan(&verification.ID, &verification.TicketID, &verification.EmployeeID, &verification.VerificationTime, &verification.Status)
        if err != nil {
            return nil, err
        }
        verifications = append(verifications, verification)
    }
    return verifications, nil
}
