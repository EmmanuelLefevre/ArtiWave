SHELL := /bin/bash
.DEFAULT_GOAL = help


## ============ HELP ============
help: ## List of commands
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-10s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'


## ============ NODE VERSION ============
# Get Node version from .nvmrc file
NODE_VERSION := $(shell type .nvmrc 2> nul)


## ============ EXPRESS SERVER ============
nvm: ## Launch Express dev server with NVM
	nvm use $(NODE_VERSION) && npm run dev
.PHONY: nvm

dev: ## Launch Express dev server with NPM
	npm run dev
.PHONY: dev


## ============ FIXTURES ============
lf: ## Launch fixtures
	npm run fixtures
.PHONY: lf