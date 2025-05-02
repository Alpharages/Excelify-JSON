# Contributing to Excelify JSON

Thank you for your interest in contributing to Excelify JSON! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/excelify-json.git
   cd excelify-json
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file with appropriate values.

4. **Install Git Hooks**
   ```bash
   pnpm prepare
   ```

## Development Workflow

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

2. **Make Changes**

   - Write your code
   - Add tests for new functionality
   - Update documentation
   - Follow the coding standards

3. **Run Tests**

   ```bash
   pnpm test
   ```

4. **Check Code Quality**

   ```bash
   pnpm lint
   pnpm format
   ```

5. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

6. **Push Changes**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to GitHub and create a pull request
   - Fill out the PR template
   - Request review from maintainers

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type
- Use async/await for asynchronous operations
- Handle errors appropriately

### Code Style

- Follow the project's ESLint configuration
- Use Prettier for code formatting
- Maximum line length: 100 characters
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Testing

- Write unit tests for new features
- Maintain or improve test coverage
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

### Documentation

- Update README.md if needed
- Add JSDoc comments for new functions
- Document environment variables
- Update API documentation

## Pull Request Process

1. **Before Submitting**

   - Ensure all tests pass
   - Run linting and formatting
   - Update documentation
   - Squash commits if necessary

2. **PR Description**

   - Describe the changes
   - Link related issues
   - Include test results
   - Add screenshots if applicable

3. **Review Process**
   - Address review comments
   - Keep the PR up to date
   - Be responsive to feedback

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:

```
feat(api): add rate limiting middleware

- Add rate limiting configuration
- Implement middleware
- Add tests

Closes #123
```

## Getting Help

- Open an issue for bugs or feature requests
- Join our community discussions
- Contact maintainers for urgent matters

## License

By contributing to Excelify JSON, you agree that your contributions will be licensed under the project's MIT License.
