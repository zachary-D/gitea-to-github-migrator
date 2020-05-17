# Gitea to GitHub migrator

A tool to migrate repositories and their metadata (issues, etc.) from Gitea to GitHub.

## Installation

Install dependencies with `npm i`

## Usage

`npm start -- <source URL> <owner name>/<repo name>`

Please note the `--` is required if you use any arguments (a quirk of npm).

Alternatively, you can call the script directly:

`node -r ts-node/register <source URL> <owner name>/<repo name>`

### Arguments

`<source URL>`

Set the repo to clone from on Gitea.

`<owner name>`

The name of the repository's owner (your user or organization)

`<repo name>` (Optional)

The name of the repository to migrate to, defaults to the name of hte repository being migrated.

### Flags

`--auth-gitea <account>` (Optional)

Sets the authentication username for Gitea.  If it is given, you will be prompted for a password later.

`--auth-github <account>`

Sets the authentication username for GitHub.  You will be prompted for a password later.
