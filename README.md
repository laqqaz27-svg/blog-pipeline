## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and Render for deployment.

The pipeline runs backend tests, checks frontend code with ESLint, builds the frontend, and triggers deployment to Render after changes are pushed to the main branch.

Changes to the main branch are protected by a ruleset requiring pull requests and code review approval.