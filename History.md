### v0.12.0
*April 2, 2016*
* Improved: upgrades shipp-server to v0.12.3 (cache warming/invalidation and bug fixes)

### v0.11.4
*March 21, 2016*
* Improved: upgrades shipp-server to v0.11.6 (query improvements)

### v0.11.3
*March 16, 2016*
* Improved: upgrades shipp-server to v0.11.5 (route fixes)

### v0.11.2
*March 16, 2016*
* Improved: upgrades shipp-server to v0.11.4 (bug fixes)

### v0.11.1
*March 16, 2016*
* Improved: upgrades shipp-server to v0.11.3 (lru-caching/relative files)

### v0.11.0
*March 16, 2016*
* Improved: consistent loggging formats
* Improved: upgrades shipp-server to v0.11.0 (logging)

### v0.10.2
*March 16, 2016*
* Improved: upgrades shipp-server to v0.10.4 (bug fixes)

### v0.10.1
*March 16, 2016*
* Improved: separates CLI/server repositories

### v0.10.0
*March 15, 2016*
* Added: exposes express via global.express
* Improved: functionality extraction
* Added: body parsing
* Added: favicon functionality

### v0.9.8
*March 14, 2016*
* Improved: BrowserSync ghostMode disabled by default
* Fixed: templated pages cache appropriately

### v0.9.7
*March 3, 2016*
* Server now finds open port
* Adds res.locals to rendering data

### v0.9.6
*March 2, 2016*
* Bundler fixes loader resolution issues
* Bundler no longer "watches" in production
* Bundler outputs error messages if applicable
* Data-store processes only JSON files, provides error handling
* Sensible Cache-Control defaults (24 hours, consistent with st)

### v0.9.5
*March 1, 2016*
* Caching and compression of compiled scripts

### v0.9.4
*March 1, 2016*
* Fixes BrowserSync bug

### v0.9.3
*March 1, 2016*
* Adds basic production mode

### v0.9.2
*March 1, 2016*
* Fixes missing data problems in data-server
* Adds logo

### v0.9.1
*February 29, 2016*
* Upgrades superloader (tons of bug fixes and tests)

### v0.9.0
*February 29, 2016*
* Rebrand
* Adds Apache v2.0 License information

### v0.8.7
*February 28, 2016*
* Overhauls file watching and allows for dynamic addition/removal

### v0.8.6
*February 28, 2016*
* Adds environment variables! And the ability for locals to ref environments

### v0.8.5
*February 28, 2016*
* CLI allows viewing/restoration of defaults
* Adds error handling: great defaults or custom too
* Updates superloader to v0.3.7 (now creates package.json on demand)

### v0.8.4
*February 27, 2016*
* Updates superloader to v0.3.6 (major bugs in previous version)

### v0.8.3
*February 26, 2016*
* Incorporates special variables (e.g. $query)
* Hints all files
* Lazily-loads defaults only as needed

### v0.8.2
*February 25, 2016*
* Switches superloader to Pipemaker version
* Allows for base routes in data
* Fixes BrowserSync full-reload issues

### v0.8.1
*February 25, 2016*
* Ensures CLI pipelines are properly formatted
* Fixes json-server's absorption of 404s
* Adds custom middleware support

### v0.8.0
*February 25, 2016*
* Initial release of CLI

Prior....ancient history!
