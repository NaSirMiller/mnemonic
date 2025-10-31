# Makefile for Mnemonic Project

# This variable stores the full command, including sudo
COMPOSE = sudo docker compose

# By declaring these "phony", we tell 'make' that they are
# command aliases and not actual files.
.PHONY: up down build clean

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

clean:
	$(COMPOSE) down -v --rmi all