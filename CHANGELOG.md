# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## version 3.1.1 - 2025-07-25

### fixed
-- fixed to support elements that contain JSX spread attributes

## version 3.1.0 - 2025-07-16

### changed
-- added support for "preact" jsx/tsx files, due to [issue](https://github.com/jacobbogers/rollup-plugin-jsx-remove-attributes/issues/7) 


## version 3.0.0 - 2025-06-03

### changed
-- swap escodegen with astring  JC Franco <jfranco@esri.com>
-- created integration test using real data fixtures

## version 2.1.1 - 2025-03-05

### changed
- package.json now has minimal versions and up, no max versions<jkfbogers@gmail.com>

## version 2.1.0 - 2024-12-22

### changed
- update typescript to 5.7.2 <jkfbogers@gmail.com>
- update rollup to 4.29.1 <jkfbogers@gmail.com>
- update @types/node to 22.10.2  <jkfbogers@gmail.com>
- update peer dependency vite to version range 6-7 <jkfbogers@gmail.com>


## version 2.0.3 - 2024-06-01

### fix
-   `data-testid` was no removed when the value was an expression jacobbogers <jkfbogers@gmail.com>
-   will work vite vite 5.2-x


## version 2.0.2 - 2024-06-01

### fix

-   various bugs fixed by: jacobbogers <jkfbogers@gmail.com>

## version 2.0.1 - 2024-06-01

### fix

-   various bugs fixed by: jacobbogers <jkfbogers@gmail.com>

## version 2.0.0 - 2024-06-01

### added by jacobbogers <info@mail.jacob-bogers.com>

-   `usage` option is optional (defaults to `rollup`)
-   `environments` option added
-   `debug` option added
-   minimum rollup version 5.1.0
-   minimum vite version 4.5.0

## version 1.0.2 - 2024-04-04

### fixed

-   Readme.md corrections:
    -   example code corrections by: Paul Welsh <1691867+spacedawwwg@users.noreply.github.com>

## version 1.0.1 - 2023-04-20

### fixed

-   Readme.md corrections:

    -   Wrong code sample in README.md for rollup usage
    -   Markdown "Rollup usage" caption corrected

-   .gitignore corrections
    -   removed `.*` entry

### changed

-   Using types exported by `estree` module and extending them.

###

## version 1.0.0 - 2023-03-18

### added

-   initial check in (Jacob Bogers <jkfbogers@gmail.com>)
