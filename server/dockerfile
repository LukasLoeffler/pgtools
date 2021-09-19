FROM python:3.9-slim

RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

RUN pip install pipenv

COPY Pipfile* .

RUN pipenv lock --keep-outdated --requirements > requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD python app.py