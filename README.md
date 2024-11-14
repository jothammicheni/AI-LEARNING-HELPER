# AI Learning Helper

**AI Learning Helper** is an interactive educational platform designed to enhance the learning experience for users through the integration of AI technologies. This project allows administrators and tutors to manage courses, provides audio translations of course materials, facilitates quiz interactions, and tracks user progress

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Services](#api-services)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Course Management**: Admins and tutors can easily add and manage courses for users.
  
- **Audio Translation**: Utilizes AI APIs to convert text into audio, enhancing accessibility and user experience.
  
- **Interactive Quizzes**: Users can engage with the system by asking quiz-related questions, receiving instant answers powered by AI.
  
- **Progress Tracking**: Monitors user progress across different courses to help tailor the learning experience.

## Technologies Used

- **Frontend**: 
  - React TypeScript
  - Tailwind CSS
  
- **Backend**: 
  - Node.js
  - Express.js
  
- **Database**: 
  - PostgreSQL with Prisma
  
- **Packages**: 
  - pnpm
  
- **AI Services**:
  - Google Text-to-Speech
  - OpenAI API

## Installation

To set up the project locally, follow these steps:-

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jothammicheni/AI-LEARNING-HELPER.git
   cd AI-LEARNING-HELPER
2. **Install Dependencies**
   Run the following command to install the necessary dependencies:

   ```bash
   pnpm install
3. **Set up the database:**
   - Ensure PostgreSQL is installed and running.
   - Create a new database and update your .env file with the database connection details.
4. **Run migrations** (if applicable):
   ```bash
   npx prisma migrate dev
5. **Start the application:**
    ```bash
    pnpm run dev
6. **Set up environment variables:**
   - Configure API keys for AI services in a .env file.

## Usage:

  - **Admin/Tutor Features:** Manage courses and monitor user progress.
  - **User Features**:
     - Access courses with an option for text-to-audio playback.
     - Take interactive quizzes with real-time AI-driven responses.
     - Track progress across multiple courses.
  
