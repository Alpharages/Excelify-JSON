# Excelify JSON

A RESTful API service that converts Excel files to structured JSON data. Built with Node.js, Express.js, and TypeScript.

## Features

- Convert Excel files (.xlsx, .xls) to structured JSON
- Process multiple sheets within a single Excel file
- Extract metadata including sheet names, row counts, and column headers
- Secure file handling with size limits and type validation
- Comprehensive error handling and response formatting

## Prerequisites

- Node.js >= 22.0.0
- pnpm >= 10.0.0

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/excelify-json.git
cd excelify-json
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

## Environment Variables

The following environment variables are available:

### Application Environment

- `NODE_ENV`: Application environment (development/production)

### Server Configuration

- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: localhost)

### Logging Configuration

- `LOG_LEVEL`: Logging verbosity (error, warn, info, debug, trace)

### API Configuration

- `API_PREFIX`: Base path for API routes (default: /api/v1)
- `API_VERSION`: API version (default: 1.0.0)

### Security

- `CORS_ORIGIN`: Allowed origins for CORS
- `RATE_LIMIT_WINDOW_MS`: Rate limiting time window (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window (default: 100)

### File Upload Configuration

- `MAX_FILE_SIZE`: Maximum file size (default: 10MB)
- `ALLOWED_FILE_TYPES`: Allowed file extensions (default: .xlsx,.xls)

## Development

Start the development server:

```bash
pnpm dev
```

## Building

Build the project:

```bash
pnpm build
```

## Testing

Run tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Generate test coverage:

```bash
pnpm test:coverage
```

## Linting and Formatting

Lint the code:

```bash
pnpm lint
```

Fix linting issues:

```bash
pnpm lint:fix
```

Format the code:

```bash
pnpm format
```

## API Endpoints

### Convert Excel to JSON

- **POST** `/api/v1/convert`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: Excel file (.xlsx or .xls)

#### Response

```json
{
  "metadata": {
    "totalSheets": 2,
    "sheetNames": ["Sheet1", "Sheet2"],
    "sheets": {
      "Sheet1": {
        "totalRows": 10,
        "columns": ["A", "B"]
      },
      "Sheet2": {
        "totalRows": 5,
        "columns": ["X", "Y"]
      }
    }
  },
  "data": {
    "Sheet1": [
      { "A": 1, "B": 2 }
      // ... more rows
    ],
    "Sheet2": [
      { "X": "a", "Y": "b" }
      // ... more rows
    ]
  }
}
```

## Error Handling

The API uses structured error responses:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

## Logging

The application uses Pino for logging with the following features:

- Development mode: Pretty-printed logs with colors
- Production mode: JSON format for better parsing
- Configurable log levels
- Request/response logging
- Error logging with stack traces

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
