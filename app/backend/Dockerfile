FROM nvidia/cuda:11.0.3-cudnn8-devel-ubuntu18.04

RUN apt-get -y update \
    && apt-get install -y software-properties-common \
    && apt-get -y update \
    && add-apt-repository universe
RUN apt-get -y update
RUN apt-get -y install python3
RUN apt-get -y install python3-pip
RUN apt-get -y install wget
RUN python3 -m pip install --upgrade pip
RUN mkdir /root/.torchxrayvision && mkdir /root/.torchxrayvision/models_data && \
wget \
https://github.com/mlmed/torchxrayvision/releases/download/v1/nih-pc-chex-mimic_ch-google-openi-kaggle-densenet121-d121-tw-lr001-rot45-tr15-sc15-seed0-best.pt \
-O /root/.torchxrayvision/models_data/nih-pc-chex-mimic_ch-google-openi-kaggle-densenet121-d121-tw-lr001-rot45-tr15-sc15-seed0-best.pt

EXPOSE 3001
RUN mkdir - /app
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

COPY . .
