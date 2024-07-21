package database

type Bus struct {
    ID         int    `json:"id"`
    BusNumber  string `json:"bus_number"`
    Capacity   int    `json:"capacity"`
}

type Route struct {
    ID           int    `json:"id"`
    StartStation string `json:"start_station"`
    EndStation   string `json:"end_station"`
}

type Schedule struct {
    ID             int    `json:"id"`
    RouteID        int    `json:"route_id"`
    DepartureTime  string `json:"departure_time"`
    ArrivalTime    string `json:"arrival_time"`
}

type Employee struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

type Passenger struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

type Ticket struct {
    ID           int    `json:"id"`
    TicketNumber string `json:"ticket_number"`
    SeatNumber   string `json:"seat_number"`
    Status       string `json:"status"`
    BusID        int    `json:"bus_id"`
    RouteID      int    `json:"route_id"`
    ScheduleID   int    `json:"schedule_id"`
    PassengerID  int    `json:"passenger_id"`
}

type TicketVerification struct {
    ID              int    `json:"id"`
    TicketID        int    `json:"ticket_id"`
    EmployeeID      int    `json:"employee_id"`
    VerificationTime string `json:"verification_time"`
    Status          string `json:"status"`
}
