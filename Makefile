ARCHES := x86 arm
FMAN_RELEASE ?= $(if $(filter production-v%,$(GITHUB_REF_NAME)),production,staging)
export FMAN_RELEASE
ifneq ($(filter $(FMAN_RELEASE),production staging),$(FMAN_RELEASE))
$(error FMAN_RELEASE must be production or staging)
endif
override PACKAGE_ID := $(if $(filter production,$(FMAN_RELEASE)),fleet-manager,fedi-dev-fleet-manager)
# overrides to s9pk.mk must precede the include statement
include node_modules/@start9labs/start-sdk/s9pk.mk

.PHONY: release
release:
	@printf 'export const production: boolean = %s\n' '$(if $(filter production,$(FMAN_RELEASE)),true,false)' > startos/release.ts

# Switching environments must rebuild the embedded selection.
javascript/index.js: release
