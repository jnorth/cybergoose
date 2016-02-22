FROM alpine
MAINTAINER Joseph North <north@sublink.ca>

RUN apk add --update \
    python \
    py-pip \
    py-crypto \
    py-paramiko \
    && rm -rf /var/cache/apk/* \
    && pip install --upgrade pip \
    && pip install --upgrade bottle dpath \
    && mkdir -p /app/assets

EXPOSE 8080

VOLUME /data
WORKDIR /app
COPY app /app

CMD [ "python", "-u", "/app/app.py" ]
