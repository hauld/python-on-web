# Simple web app which allows to write python code and run on browser

## Description
This example shows how to use python web worker (pyodide) in Next.JS | ReactJS.
Features:
- Import packages "numpy", "pytz", "pandas" by default
- Add / Remove cell of code
- Execute each cell or entire workbook
- Add javascript api for using in python: sample function fetch_json
## Running localy
First, run the development server:

```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to have fun with python coding in browser.

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2. Build your container: `docker build -t pyworkbook .`.
3. Run your container: `docker run -p 3000:3000 pyworkbook`.