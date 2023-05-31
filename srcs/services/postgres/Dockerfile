FROM postgres:15.2

ENV POSTGRES_DB pongo
COPY pongo.sql /
COPY dropall.sql /

RUN mkdir -p /var/lib/postrgresudo sql/data/pg_notify
