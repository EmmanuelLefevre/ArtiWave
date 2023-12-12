SHELL := /bin/bash
.DEFAULT_GOAL = help


## ============ HELP ============
help: ## List of commands
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-10s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'


## ============ EXPRESS SERVER ============
svp: ## Launch Express prod server
	npm run start
.PHONY: sv

svd: ## Launch Express dev server
	npm run dev
.PHONY: sv


## ============ FIXTURES ============
lf: ## Launch fixtures
	node dataFixtures/fixture.js
.PHONY: lf