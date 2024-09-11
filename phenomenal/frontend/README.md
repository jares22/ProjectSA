# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```



-- Inserting 10 data entries into Member table
INSERT INTO Members (Username, Password, Firstname, Lastname, Email, Birthday) 
VALUES 
('john_doe', 'password123', 'John', 'Doe', 'john@example.com', '1990-01-01'),
('jane_smith', 'securepass', 'Jane', 'Smith', 'jane@example.com', '1985-05-20'),
('alice_walker', 'alicepass', 'Alice', 'Walker', 'alice@example.com', '1992-02-15'),
('bob_marley', 'reggae123', 'Bob', 'Marley', 'bob@example.com', '1980-07-06'),
('charlie_brown', 'charlie123', 'Charlie', 'Brown', 'charlie@example.com', '1991-09-09'),
('david_clark', 'clarkpass', 'David', 'Clark', 'david@example.com', '1988-04-11'),
('eve_adams', 'evepass', 'Eve', 'Adams', 'eve@example.com', '1989-11-03'),
('frank_smith', 'frankpass', 'Frank', 'Smith', 'frank@example.com', '1993-08-19'),
('grace_hopper', 'grace123', 'Grace', 'Hopper', 'grace@example.com', '1987-06-24'),
('henry_ford', 'ford123', 'Henry', 'Ford', 'henry@example.com', '1994-03-22');

-- Inserting 10 data entries into Employee table
INSERT INTO Employees (Username, Password, Firstname, Lastname, Position, Phone_number) 
VALUES 
('emp1', 'pass123', 'Alice', 'Brown', 'Driver', '555-1234'),
('emp2', 'pass456', 'Bob', 'Johnson', 'Manager', '555-5678'),
('emp3', 'pass789', 'Clara', 'Smith', 'Conductor', '555-6789'),
('emp4', 'pass012', 'Dan', 'Williams', 'Driver', '555-7890'),
('emp5', 'pass345', 'Eva', 'Thompson', 'Driver', '555-8901'),
('emp6', 'pass678', 'Frank', 'Brown', 'Mechanic', '555-9012'),
('emp7', 'pass910', 'George', 'Taylor', 'Manager', '555-0123'),
('emp8', 'pass112', 'Helen', 'Wilson', 'Conductor', '555-2345'),
('emp9', 'pass314', 'Ian', 'Clark', 'Driver', '555-3456'),
('emp10', 'pass516', 'Jack', 'Lewis', 'Driver', '555-4567');

-- Inserting 10 data entries into Vehicles table
INSERT INTO Vehicles (Type) 
VALUES 
('Bus Type A'), 
('Bus Type B'), 
('Bus Type C'), 
('Bus Type D'), 
('Bus Type E'), 
('Bus Type F'), 
('Bus Type G'), 
('Bus Type H'), 
('Bus Type I'), 
('Bus Type J');

-- Inserting 10 data entries into Drivers table
INSERT INTO Drivers (bus_id, Employee_ID) 
VALUES 
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), 
(6, 6), (7, 7), (8, 8), (9, 9), (10, 10);

-- Inserting 10 data entries into Route table
INSERT INTO Routes (Name_Route, Routeway) 
VALUES 
('Route 1', 'City A - City B'), 
('Route 2', 'City C - City D'), 
('Route 3', 'City E - City F'), 
('Route 4', 'City G - City H'), 
('Route 5', 'City I - City J'), 
('Route 6', 'City K - City L'), 
('Route 7', 'City M - City N'), 
('Route 8', 'City O - City P'), 
('Route 9', 'City Q - City R'), 
('Route 10', 'City S - City T');

-- Inserting 10 data entries into BusTiming table
INSERT INTO Bus_Timings (Departure_Day, Departure_Time, Return_Day, Return_Time, Bus_ID, Route_ID) 
VALUES 
('Monday', '08:00', 'Monday', '18:00', 1, 1),
('Tuesday', '09:00', 'Tuesday', '19:00', 2, 2),
('Wednesday', '10:00', 'Wednesday', '20:00', 3, 3),
('Thursday', '11:00', 'Thursday', '21:00', 4, 4),
('Friday', '12:00', 'Friday', '22:00', 5, 5),
('Saturday', '13:00', 'Saturday', '23:00', 6, 6),
('Sunday', '14:00', 'Sunday', '00:00', 7, 7),
('Monday', '15:00', 'Monday', '01:00', 8, 8),
('Tuesday', '16:00', 'Tuesday', '02:00', 9, 9),
('Wednesday', '17:00', 'Wednesday', '03:00', 10, 10);

-- Inserting 10 data entries into Seat table
INSERT INTO Seats (Seat_Number, Bus_ID) 
VALUES 
(1, 1), (2, 1), (3, 2), (4, 2), (5, 3), 
(6, 3), (7, 4), (8, 4), (9, 5), (10, 5);

-- Inserting 10 data entries into Passenger table
INSERT INTO Passengers (Ticket_Number, Username, Phone_Number, Seat_ID, Member_ID, Status) 
VALUES 
('T123', 'john_doe', '123-456-7890', 1, 1, 'Booked'),
('T124', 'jane_smith', '098-765-4321', 2, 2, 'Checked-In'),
('T125', 'alice_walker', '234-567-8901', 3, 3, 'Booked'),
('T126', 'bob_marley', '345-678-9012', 4, 4, 'Checked-In'),
('T127', 'charlie_brown', '456-789-0123', 5, 5, 'Booked'),
('T128', 'david_clark', '567-890-1234', 6, 6, 'Checked-In'),
('T129', 'eve_adams', '678-901-2345', 7, 7, 'Booked'),
('T130', 'frank_smith', '789-012-3456', 8, 8, 'Checked-In'),
('T131', 'grace_hopper', '890-123-4567', 9, 9, 'Booked'),
('T132', 'henry_ford', '901-234-5678', 10, 10, 'Checked-In');

-- Inserting 10 data entries into Payment table
INSERT INTO Payments (Bus_Round, Passenger_ID) 
VALUES 
('2024-09-01 08:00:00', 1),
('2024-09-02 09:00:00', 2),
('2024-09-03 10:00:00', 3),
('2024-09-04 11:00:00', 4),
('2024-09-05 12:00:00', 5),
('2024-09-06 13:00:00', 6),
('2024-09-07 14:00:00', 7),
('2024-09-08 15:00:00', 8),
('2024-09-09 16:00:00', 9),
('2024-09-10 17:00:00', 10);

-- Inserting 10 data entries into TicketVerification table
INSERT INTO Ticket_Verifications (Ticket_ID, Driver_ID, Verification_Time, Status, Bustiming_ID) 
VALUES 
(1, 1, '2024-09-01 08:30:00', 'Verified', 1),
(2, 2, '2024-09-02 09:30:00', 'Verified', 2),
(3, 3, '2024-09-03 10:30:00', 'Verified', 3),
(4, 4, '2024-09-04 11:30:00', 'Verified', 4),
(5, 5, '2024-09-05 12:30:00', 'Verified', 5),
(6, 6, '2024-09-06 13:30:00', 'Verified', 6),
(7, 7, '2024-09-07 14:30:00', 'Verified', 7),
(8, 8, '2024-09-08 15:30:00', 'Verified', 8),
(9, 9, '2024-09-09 16:30:00', 'Verified', 9),
(10, 10, '2024-09-10 17:30:00', 'Verified', 10);

-- Inserting 10 data entries into RouteData table
INSERT INTO Route_Data (Province1, Province2, Distance, Time) 
VALUES 
('City A', 'City B', 150.5, 180),
('City C', 'City D', 200.0, 240),
('City E', 'City F', 120.5, 150),
('City G', 'City H', 175.0, 200),
('City I', 'City J', 300.0, 300),
('City K', 'City L', 250.0, 270),
('City M', 'City N', 180.0, 210),
('City O', 'City P', 130.0, 160),
('City Q', 'City R', 220.0, 230),
('City S', 'City T', 190.0, 220);
