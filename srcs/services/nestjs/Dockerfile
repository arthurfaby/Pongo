FROM node:18.15.0

WORKDIR /var/www/backend

COPY ./conf/nestjs-entrypoint.sh /usr/bin/

RUN chmod 755 /usr/bin/nestjs-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["nestjs-entrypoint.sh"]

CMD [ "npm", "start", "--watch" ]
