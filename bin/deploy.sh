#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Version
VERSION="1.0.0"

# Function to print colored messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_debug() {
    echo -e "${BLUE}[DEBUG]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to check if docker-compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed. Please install it first."
        exit 1
    fi
}

# Function to check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found!"
        print_message "Creating .env file with default values..."
        cat > .env << EOL
PORT=3000
NODE_ENV=production
# Add your custom environment variables below
EOL
        print_message ".env file created successfully!"
    fi
}

# Function to validate environment variables
validate_env() {
    if [ -z "$(grep '^PORT=' .env)" ]; then
        print_warning "PORT not set in .env, using default: 3000"
    fi
    if [ -z "$(grep '^NODE_ENV=' .env)" ]; then
        print_warning "NODE_ENV not set in .env, using default: production"
    fi
}

# Function to start the application
start() {
    print_message "Starting the application..."
    if docker-compose up -d; then
        print_message "Application started successfully!"
        status
    else
        print_error "Failed to start the application!"
        exit 1
    fi
}

# Function to stop the application
stop() {
    print_message "Stopping the application..."
    if docker-compose down; then
        print_message "Application stopped successfully!"
    else
        print_error "Failed to stop the application!"
        exit 1
    fi
}

# Function to restart the application
restart() {
    print_message "Restarting the application..."
    if docker-compose restart; then
        print_message "Application restarted successfully!"
        status
    else
        print_error "Failed to restart the application!"
        exit 1
    fi
}

# Function to view logs
logs() {
    print_message "Viewing logs..."
    docker-compose logs -f
}

# Function to rebuild and start
rebuild() {
    print_message "Rebuilding and starting the application..."
    if docker-compose up -d --build; then
        print_message "Application rebuilt and started successfully!"
        status
    else
        print_error "Failed to rebuild the application!"
        exit 1
    fi
}

# Function to show status
status() {
    print_message "Container status:"
    docker-compose ps
}

# Function to clean up
cleanup() {
    print_message "Cleaning up..."
    docker-compose down -v --remove-orphans
    print_message "Cleanup completed!"
}

# Function to show help
show_help() {
    echo -e "${BLUE}Deploy Script v${VERSION}${NC}"
    echo
    echo "Usage: $0 {command} [options]"
    echo
    echo "Commands:"
    echo "  start     - Start the application"
    echo "  stop      - Stop the application"
    echo "  restart   - Restart the application"
    echo "  logs      - View application logs"
    echo "  rebuild   - Rebuild and start the application"
    echo "  status    - Show container status"
    echo "  cleanup   - Clean up containers and volumes"
    echo "  help      - Show this help message"
    echo
    echo "Options:"
    echo "  --debug   - Enable debug mode"
    echo
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs"
    echo "  $0 rebuild"
}

# Check for debug mode
if [[ "$*" == *"--debug"* ]]; then
    set -x
fi

# Check prerequisites
check_docker
check_docker_compose

# Main script
case "$1" in
    "start")
        check_env
        validate_env
        start
        ;;
    "stop")
        stop
        ;;
    "restart")
        restart
        ;;
    "logs")
        logs
        ;;
    "rebuild")
        check_env
        validate_env
        rebuild
        ;;
    "status")
        status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

exit 0