.PHONY: build
build: clean
	mkdir dist
	cp -r src package.json README.md dist/
	cp tsconfig.build.json dist/tsconfig.json
	cd dist && ../node_modules/.bin/tsc

.PHONY: clean
clean:
	rm -rf dist build *.tsbuildinfo
