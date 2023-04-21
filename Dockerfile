FROM lipanski/docker-static-website:2.1.0

COPY ./docs .

CMD ["/busybox", "httpd", "-f", "-v", "-p", "3000", "-c", "httpd.conf"]
