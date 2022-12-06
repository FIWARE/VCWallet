# Use the official golang docker image
FROM golang:1.18 AS build

# The directory to place source files
WORKDIR /usr/src/app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# Copy all backend files
COPY ./back ./back
COPY ./configs ./configs
COPY ./ent ./ent
COPY ./internal ./internal

# Build the app. We use CGO_ENABLED=1 (the defaul if not specified) so it can use things like github.com/mattn/go-sqlite3
# This means that it can not be run in Alpine, unless this is changed to CGO_ENABLED=0 and you
# do not use any packages that require it
# If you change CGO_ENABLED to 0, then you can reduce more the final image size by changing the final distroless image
# from 'gcr.io/distroless/base-debian11' to 'gcr.io/distroless/static-debian11' which
# does not include glibc, libssl and openssl
RUN CGO_ENABLED=1 go build -o /usr/local/bin/app back/back.go



# Use a distroless image to make it as small as possible. The smallest one ('gcr.io/distroless/static-debian11') can only
# be used if you also change to 'CGO_ENABLED=1'
FROM gcr.io/distroless/base-debian11

# Copy all the web assets and config files
COPY --from=build /usr/src/app/back/www /www
COPY --from=build /usr/src/app/configs /configs

# Copy the application binary
COPY --from=build /usr/local/bin/app /

# Expose port 3000 (unless the app uses another port)
EXPOSE 3000

CMD ["/app"]