# Getting started

1. Install yarn `npm install --global yarn`
2. Install dependencies `yarn install`
3. Create postgresql database `docker run --name kuka-soittaa-database -e POSTGRES_PASSWORD=<password> -p 5432:5432 -d postgres`
4. Create file `.env` and add the environment variable `DATABASE_URL="postgresql://postgres:<password>@localhost:5432"`
5. Start development server `yarn start`
