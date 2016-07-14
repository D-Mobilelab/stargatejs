GIT_REVISION=$(git describe --tags --long)
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
echo "var pkgInfo = {\"version\":\"$PACKAGE_VERSION\", \"build\":\"$GIT_REVISION\"};module.exports = pkgInfo;" > src/info.js
echo "{\"source\":\"src\", \"destination\":\"docs/$PACKAGE_VERSION\"}" > esdoc.json