project_name = fasterback
image_name = fasterback:latest

build_go:
	go build -o ./bin/back back/back.go

build:
	go run faster.go build

install:
	go install faster.go

runback:
	go run back/back.go

runfront:
	go run faster.go build serve

cleandb:
	rm ~/.siop2/webauthn.sqlite

requirements:
	go mod tidy

clean-packages:
	go clean -modcache

up: 
	make up-silent
	make shell

builddocker:
	docker build -t $(image_name) .

build-no-cache:
	docker build --no-cache -t $(image_name) .

up-silent:
	make delete-container-if-exist
	docker run -d -p 3000:3000 --name $(project_name) $(image_name)

upfore:
	docker run --rm -p 8000:8000 --name $(project_name) $(image_name)

delete-container-if-exist:
	docker stop $(project_name) || true && docker rm $(project_name) || true

shell:
	docker exec -it $(project_name) /bin/sh

stop:
	docker stop $(project_name)

start:
	docker start $(project_name)

rundocker:
	docker run --rm -v "$PWD":/usr/src/myapp -p 8000:8000 --name $(project_name) -w /usr/src/myapp golang:1.18 go build -v
