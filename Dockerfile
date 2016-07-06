FROM alpine
MAINTAINER Joseph North <north@sublink.ca>

RUN apk add --update --no-cache \
    build-base \
    python3 \
    python3-dev \
    openssl-dev \
    libffi-dev \
    && python3 -m ensurepip \
    && pip3 install --upgrade pip \
    && pip3 install --upgrade bottle dpath paramiko \
    && mkdir -p /app/assets

EXPOSE 8080

VOLUME /data
WORKDIR /app
COPY app /app

CMD [ "python3", "-u", "/app/app.py" ]
