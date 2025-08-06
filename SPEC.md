# Summer Productivity MCP Server Specification

This document outlines the design and implementation plan for a Summer Productivity MCP server that provides three core productivity tools: calendar management, focus music playlists, and daily task planning.

The MCP server will support adding and viewing calendar events, managing focus music playlists with simulated playback, and creating/listing daily tasks. The system will be built using Cloudflare Workers with Hono as the API framework, Cloudflare D1 for data persistence, and the MCP SDK for tool integration.

## 1. Technology Stack

- **Edge Runtime:** Cloudflare Workers
- **API Framework:** Hono.js (TypeScript-based API framework)
- **Database:** Cloudflare D1 (serverless SQLite)
- **ORM:** Drizzle ORM for type-safe database operations
- **MCP Integration:** @modelcontextprotocol/sdk and @hono/mcp
- **Authentication:** Better Auth with Fiberplane OAuth provider

## 2. Database Schema Design

The database will store calendar events, music playlists with tracks, and daily tasks. Each entity will be associated with authenticated users.

### 2.1. Users Table

- id (TEXT, Primary Key)
- email (TEXT, NOT NULL, UNIQUE)
- name (TEXT)
- created_at (INTEGER, NOT NULL)
- updated_at (INTEGER, NOT NULL)

### 2.2. Calendar Events Table

- id (TEXT, Primary Key)
- user_id (TEXT, Foreign Key to users.id)
- title (TEXT, NOT NULL)
- description (TEXT)
- start_time (INTEGER, NOT NULL) // Unix timestamp
- end_time (INTEGER, NOT NULL) // Unix timestamp
- location (TEXT)
- created_at (INTEGER, NOT NULL)
- updated_at (INTEGER, NOT NULL)

### 2.3. Music Playlists Table

- id (TEXT, Primary Key)
- user_id (TEXT, Foreign Key to users.id)
- name (TEXT, NOT NULL)
- description (TEXT)
- is_active (INTEGER, DEFAULT 0) // Boolean for currently playing playlist
- created_at (INTEGER, NOT NULL)
- updated_at (INTEGER, NOT NULL)

### 2.4. Music Tracks Table

- id (TEXT, Primary Key)
- playlist_id (TEXT, Foreign Key to playlists.id)
- title (TEXT, NOT NULL)
- artist (TEXT, NOT NULL)
- duration (INTEGER, NOT NULL) // Duration in seconds
- track_order (INTEGER, NOT NULL)
- is_current (INTEGER, DEFAULT 0) // Boolean for currently playing track
- created_at (INTEGER, NOT NULL)

### 2.5. Daily Tasks Table

- id (TEXT, Primary Key)
- user_id (TEXT, Foreign Key to users.id)
- title (TEXT, NOT NULL)
- description (TEXT)
- completed (INTEGER, DEFAULT 0) // Boolean
- priority (TEXT, DEFAULT 'medium') // low, medium, high
- due_date (TEXT) // ISO date string (YYYY-MM-DD)
- created_at (INTEGER, NOT NULL)
- updated_at (INTEGER, NOT NULL)

## 3. API Endpoints

The API will provide standard REST endpoints for web access and an MCP endpoint for tool integration.

### 3.1. Authentication Endpoints

- **GET /login**
  - Description: Initiates OAuth login flow with Fiberplane
  - Redirects to Better Auth OAuth handler

- **GET /logout**
  - Description: Logs out the current user
  - Clears session and redirects

### 3.2. Calendar Endpoints

- **POST /api/calendar/events**
  - Description: Create a new calendar event
  - Expected Payload:
    ```json
    {
      "title": "Team Meeting",
      "description": "Weekly sync",
      "start_time": "2024-07-15T10:00:00Z",
      "end_time": "2024-07-15T11:00:00Z",
      "location": "Conference Room A"
    }
    ```

- **GET /api/calendar/events**
  - Description: Retrieve calendar events for authenticated user
  - Query Params: start_date, end_date (ISO date strings)

### 3.3. Music Player Endpoints

- **GET /api/music/playlists**
  - Description: Get all playlists for authenticated user

- **POST /api/music/playlists**
  - Description: Create a new focus playlist
  - Expected Payload:
    ```json
    {
      "name": "Deep Focus",
      "description": "Ambient sounds for concentration",
      "tracks": [
        {
          "title": "Forest Rain",
          "artist": "Nature Sounds",
          "duration": 600
        }
      ]
    }
    ```

- **POST /api/music/play/{playlist_id}**
  - Description: Start playing a playlist (simulated)
  - Sets playlist as active and begins track progression

- **GET /api/music/now-playing**
  - Description: Get current playback status
  - Returns current playlist, track, and playback position

### 3.4. Daily Planner Endpoints

- **POST /api/tasks**
  - Description: Create a new daily task
  - Expected Payload:
    ```json
    {
      "title": "Review project proposal",
      "description": "Check budget and timeline",
      "priority": "high",
      "due_date": "2024-07-15"
    }
    ```

- **GET /api/tasks**
  - Description: Get tasks for authenticated user
  - Query Params: date (ISO date), completed (boolean), priority

- **PATCH /api/tasks/{task_id}**
  - Description: Update task (mark complete, change priority, etc.)

### 3.5. MCP Server Endpoint

- **ALL /mcp**
  - Description: MCP JSON-RPC endpoint for tool integration
  - Handles MCP protocol requests for all three productivity tools

## 4. MCP Tools Implementation

The MCP server will expose three main tools:

### 4.1. Calendar Manager Tool

- **add_calendar_event**: Creates calendar events with validation
- **view_calendar_events**: Retrieves events within date ranges
- **get_upcoming_events**: Shows next few upcoming events

### 4.2. Focus Music Player Tool

- **create_playlist**: Creates new focus playlists with tracks
- **play_playlist**: Starts simulated playback of a playlist
- **get_now_playing**: Returns current playback status
- **list_playlists**: Shows available focus playlists

### 4.3. Daily Planner Tool

- **add_task**: Creates new daily tasks with priority and due dates
- **list_tasks**: Retrieves tasks with filtering options
- **complete_task**: Marks tasks as completed
- **update_task_priority**: Changes task priority levels

## 5. Integrations

- **Better Auth**: For user authentication with Fiberplane OAuth provider
- **MCP SDK**: For implementing Model Context Protocol server functionality
- **Drizzle ORM**: For type-safe database operations with D1

## 6. Additional Notes

The music player is intentionally simulated - it manages playlist metadata and provides "now playing" information without actual audio streaming. Track progression will be simulated using timestamps and duration calculations.

The system requires authentication to associate data with users. All MCP tools will validate user sessions before performing operations.

Calendar events should support timezone handling and validation for logical start/end times. Tasks should support priority levels and optional due dates for flexible planning.

## 7. Further Reading

Take inspiration from the project template here: https://github.com/fiberplane/create-honc-app/tree/main/templates/d1