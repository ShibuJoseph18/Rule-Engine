# Rule Engine

A powerful rule engine built using the PERN stack (PostgreSQL, Express, React, Node.js). This system enables dynamic creation, modification, and evaluation of rules based on user-defined criteria.

## ✨ Features

- **Dynamic Rule Creation**: Create and modify rules through an intuitive user interface
- **Abstract Syntax Tree (AST) Representation**: Efficient rule storage and evaluation using AST
- **Real-time Rule Evaluation**: Instant evaluation of rules against input data
- **RESTful API**: Comprehensive API for rule management and evaluation

## 🎯 Design Choices

### Architecture
- Modular design with separated frontend and backend components
- RESTful API for client-server communication
- 3-tier architecture for organized business logic implementation

### Technology Stack
- **Database**: PostgreSQL
- **Backend**: Express.js
- **Frontend**: React
- **ORM**: Sequelize
- **AST Processing**: Custom services for rule transformation and evaluation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v13+)
- NPM (Node Package Manager)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your_username/rule-engine.git
cd rule-engine
```

#### 2. Database Setup
Configure your PostgreSQL database by creating a `.env` file in the project root:

```plaintext
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

**Note**: Replace placeholder values with your actual database credentials.

#### 3. Install Dependencies

Backend setup:
```bash
cd backend
npm install
```

Frontend setup:
```bash
cd ../frontend
npm install
```

#### 4. Initialize Database
Run the database setup script:
```bash
node backend/scripts/populateRules.js
```

#### 5. Launch Application

Start backend server:
```bash
cd backend
npm start
```

Start frontend development server:
```bash
cd ../frontend
npm run dev
```

## 📝 Usage

1. Navigate to `http://localhost:5173/` in your web browser
2. Create and modify rules using the intuitive interface
3. Test rules with real-time evaluation
4. View evaluation results based on your input

## 🔒 Security Features

- Environment variables for sensitive data
- Input validation against SQL injection
- API security best practices

## 📦 Dependencies

### Core Dependencies
- Node.js
- PostgreSQL
- Express.js
- React
- Sequelize

### Additional Packages
- dotenv
- Additional dependencies listed in `package.json`

## 📊 Database Schema

### Rules Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| name | VARCHAR | Rule name |
| ruleString | TEXT | Original rule string |
| ast_root | JSONB | AST representation |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

## 🛠️ Development


### Key Components
- **Rule Parser**: Converts rule strings to AST
- **Rule Evaluator**: Processes AST against input data
- **Rule Manager**: Handles CRUD operations for rules


## 🔮 Future Enhancements

- Rule versioning system
- Advanced rule templates
- Performance optimization for complex rule evaluation
- Integration with external systems
- Enhanced visualization of rule relationships