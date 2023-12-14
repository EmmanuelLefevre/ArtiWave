SHELL := /bin/bash
.DEFAULT_GOAL = help


## ============ HELP ============
help: ## List of commands
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-10s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'


## ============ NODE VERSION ============
# Get Node version from .nvmrc file
NODE_VERSION := $(shell type .nvmrc 2> nul)


## ============ EXPRESS SERVER ============
psv: ## Launch Express prod server
	nvm use $(NODE_VERSION) && npm run start
.PHONY: sv

dsv: ## Launch Express dev server
	nvm use $(NODE_VERSION) && npm run dev
.PHONY: sv


## ============ FIXTURES ============
lf: ## Launch fixtures
	npm run fixtures
.PHONY: lf