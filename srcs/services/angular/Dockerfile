FROM node:18.15.0

WORKDIR /var/www/frontend

COPY conf/angular-entrypoint.sh /usr/bin/

RUN chmod 755 /usr/bin/angular-entrypoint.sh

EXPOSE 4200

ENTRYPOINT ["angular-entrypoint.sh"]

CMD ["npm", "start", "--watch"]
