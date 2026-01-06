# Vision360

A modern web application built with [Vite](https://vitejs.dev/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/). This project utilizes [Shadcn UI](https://ui.shadcn.com/) for building accessible and customizable components, along with [Tailwind CSS](https://tailwindcss.com/) for styling.

## Features

- **Framework**: React + Vite for fast development and HMR.
- **Language**: TypeScript for type safety.
- **Styling**: Tailwind CSS + Shadcn UI.
- **Routing**: React Router DOM.
- **State Management**: TanStack Query (React Query) for server state management.
- **Form Handling**: React Hook Form with Zod validation.

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/raaznp/vision360.git
    cd vision360
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080` (or the port shown in your terminal).

### Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist` directory.

### Linting

To run the linter:

```bash
npm run lint
```

## Project Structure

- `src/`: Source code including components, pages, and hooks.
- `public/`: Static assets.
- `components.json`: Configuration for Shadcn UI.
- `vite.config.ts`: Vite configuration.

## License

[MIT](LICENSE)
