# BuildSmart

A modern React-based construction management application designed to streamline building projects and enhance team collaboration.

## Features

- **Staff Login**: Secure staff authentication with credentials stored in a JSON database.
- **Responsive Navigation**: Sleek, mobile-friendly navbar with animated transitions.
- **Featured Projects Carousel**: Seamless, full-width, auto-scrolling project carousel with images and project details loaded from a JSON file.
- **Footer**: Company address with a Google Maps link, always at the bottom of the page.
- **Backend Integration**: Spring Boot backend for serving project data (and potentially more in the near future).

## Future additions

- **MySQL**: Incorporate MySQL databases to store data instead of only using JSON files
- **Password Hashing**: Store and retrieve passwords securely
- **Projects**: Work and track project data and budget
- ...more to come

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/Warner-Ham/BuildSmart.git

# Navigate to the project directory
cd BuildSmart

# Install dependencies
npm install

# Start the development server
npm start
```

## Project Structure

```
BuildSmart/
├── public/
│   ├── index.html
│   └── [logo.jpg](http://_vscodecontentref_/0)
├── src/
│   ├── App.css
│   ├── [App.js](http://_vscodecontentref_/1)
│   ├── index.js
│   ├── staff_db.json
│   └── projects_db.json
├── backend/
│   └── ... (Spring Boot backend code)
├── [package.json](http://_vscodecontentref_/2)
└── [README.md](http://_vscodecontentref_/3)
```

## License

MIT
