FROM alpine
MAINTAINER Joseph North <north@sublink.ca>

RUN apk add --update \
    python \
    py-pip \
    openssh-client \
    sshpass \
    && rm -rf /var/cache/apk/* \
    && pip install --upgrade pip bottle dpath \
    && mkdir -p /app/assets

EXPOSE 8080

VOLUME /data
WORKDIR /app
COPY app.py /app
COPY lib /app/lib
COPY assets /app/assets

CMD [ "python", "-u", "/app/app.py" ]
