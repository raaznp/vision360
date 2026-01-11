# Vision 360° - Safety Training System

A comprehensive Safety Training System built for modern enterprises. Vision 360° allows organizations to manage employee training, track progress, issue certificates, and maintain safety compliance with a premium, user-friendly interface.

![Vision 360 Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop)

## 🚀 Key Features

- **Interactive Dashboard**: Real-time overview of training progress, active courses, and certification status.
- **Course Management**: Rich media support for safety courses, quizzes, and multimedia lessons.
- **Certification System**: Automated generation of PDF certificates upon successful course completion (80%+ score).
- **Role-Based Access Control (RBAC)**: Secure "Admin" and "User" roles.
  - **Admins**: Manage users, view activity logs, and oversee the system.
  - **Staff/Users**: Enroll in courses, take exams, and view their history.
- **Activity Logging**: Comprehensive audit trail for all critical system actions.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠 Tech Stack

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + Lucide Icons
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **State Management**: React Context + TanStack Query
- **PDF Generation**: jsPDF

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/raaznp/vision360.git
    cd vision360
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (copy from `.env.example`):

    ```bash
    cp .env.example .env
    ```

    Update the values with your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:8080`.

## 🧪 Demo Credentials

You can use the following credentials to explore the system (if using the provided demo database):

| Role      | Email                | Password          |
| :-------- | :------------------- | :---------------- |
| **Admin** | `test@vision360.com` | `2"U]baYn!w,9h%S` |

## 🛡️ Admin Features

To access the Admin Panel:

1.  Log in with an Admin account.
2.  Click the **Profile Avatar** in the top right.
3.  Select **Users & Staff** or **Activity Logs**.

From here you can:

- Add new users directly (generates instant profile).
- Promote users to 'Admin' or 'Staff'.
- Delete users.
- View a timeline of all system activities.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
