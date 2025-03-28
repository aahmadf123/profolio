# Profolio

My personal website

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/aahmadf123/profolio.git
   cd profolio
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
   NEXT_PUBLIC_APP_URL=your_app_url
   NEXT_PUBLIC_CALENDLY_ORGANIZATION=your_calendly_organization
   ```

4. **Run the development server:**
   ```sh
   pnpm dev
   ```

5. **Build for production:**
   ```sh
   pnpm build
   ```

6. **Start the production server:**
   ```sh
   pnpm start
   ```

## Usage Examples

- **Access the admin dashboard:**
  Navigate to `/admin` to access the admin dashboard.

- **Create a backup:**
  Go to `/admin/backups` and click on "Create Backup" to create a new backup.

- **Restore a backup:**
  Go to `/admin/backups`, click on "Restore Backup", and select the backup file to restore.

## Contribution Guidelines

1. **Fork the repository:**
   Click on the "Fork" button at the top right corner of the repository page.

2. **Clone your forked repository:**
   ```sh
   git clone https://github.com/your-username/profolio.git
   cd profolio
   ```

3. **Create a new branch:**
   ```sh
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes:**
   Implement your feature or fix the bug.

5. **Commit your changes:**
   ```sh
   git add .
   git commit -m "Add your commit message"
   ```

6. **Push to your branch:**
   ```sh
   git push origin feature/your-feature-name
   ```

7. **Create a pull request:**
   Go to the original repository and click on "New Pull Request". Select your branch and submit the pull request.

## Coding Standards

- **Use ESLint and Prettier:**
  Ensure your code follows the coding standards by running the following commands:
  ```sh
  pnpm lint
  pnpm format
  ```

- **Consistent coding styles:**
  - Use single quotes for strings.
  - Maintain consistent import ordering.
  - Follow the Airbnb style guide.

- **Document your code:**
  Add comments and documentation to your code where necessary.

- **Write tests:**
  Ensure your code is covered by unit and integration tests.

## License

This project is licensed under the MIT License.
