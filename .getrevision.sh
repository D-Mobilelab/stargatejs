GIT_REVISION=$(git describe --tags --long)
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
echo "{\"version\":\"$PACKAGE_VERSION\", \"build\":\"$GIT_REVISION\"}" > src/info.json
echo "{\"source\":\"src\", \"destination\":\"docs/$PACKAGE_VERSION\"}" > esdoc.json