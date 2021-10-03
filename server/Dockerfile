FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
&& rm -rf /var/lib/apt/lists/*

RUN pip install pipenv

COPY Pipfile* .

RUN pipenv lock --keep-outdated --requirements > requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python","-u","app.py"]
