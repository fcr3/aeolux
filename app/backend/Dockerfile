FROM python:3.8-slim-buster
EXPOSE 3001
RUN mkdir - /app
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .