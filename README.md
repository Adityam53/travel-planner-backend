# Travel Planner Backend API

A Node.js + Express backend that generates AI-powered travel itineraries using OpenRouter AI models.

It takes a city, country, and duration as input and returns a structured JSON travel plan including attractions, itinerary, budget estimates, and local tips.

---

## Features

* AI-generated travel itineraries
* Structured JSON output using strict schema
* OpenRouter AI integration
* Dynamic query parameters (city, country, days)
* Health check endpoint
* CORS enabled API

---

## Tech Stack

* Node.js
* Express.js
* OpenAI SDK (OpenRouter compatible)
* dotenv
* cors

---

## Project Structure

```
project-root/
│
├── index.js (or server.js)
├── .env
├── package.json
```

---

## Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/Adityam53/travel-planner-backend.git
cd travel-planner-backend
```

### 2. Install dependencies

```
npm install
```

### 3. Create .env file

```
OPENAPIROUTERKEY=your_openrouter_api_key
PORT=3000
```

---

## Run the Server

```
npm start
```

Server runs on:

```
http://localhost:3000
```

---

## API Endpoints

### Health Check

GET /health

Response:

```
{
  "ok": true
}
```

---

### Generate Travel Plan

GET /api/travel-plan

Query Parameters:

* city (default: Paris)
* country (default: France)
* days (default: 7)

Example:

```
/api/travel-plan?city=Rome&country=Italy&days=5
```

---

## Response Format

The API returns strict JSON in this format:

```
{
  "destination": "city, country",
  "best_time": "string",
  "duration_days": number,
  "top_attractions": ["string"],
  "sample_itinerary": [
    {
      "day": number,
      "plan": "string"
    }
  ],
  "estimated_budget_eur": {
    "low": number,
    "mid": number,
    "high": number
  },
  "local_tips": ["string"]
}
```

---

## AI Prompt Behavior

The system prompt enforces:

* Strict JSON-only output
* No markdown or extra text
* Structured itinerary generation
* Budget estimation in EUR

If the model returns invalid JSON, the API responds with a 502 error and raw output.

---

## Error Handling

* 200: Success
* 400: Bad request (invalid input)
* 502: Invalid AI response format
* 500: Server or API failure

---

## Environment Variables

```
OPENAPIROUTERKEY=your_api_key_here
PORT=3000
```

---

## Example Request

```
GET /api/travel-plan?city=Tokyo&country=Japan&days=6
```

---

## Example Use Case

* Travel planning apps
* AI itinerary generators
* Trip budgeting tools
* Smart travel assistants

---

## Future Improvements

* Add authentication (API keys / JWT)
* Save travel plans in database
* Add user history
* Add multi-language support
* Add map integration for attractions
* Improve prompt tuning for better accuracy

---

## Author

Built using Node.js, Express, and OpenRouter AI models

## Contact
For any bugs contact adityamoorjmalani53@gmail.com
