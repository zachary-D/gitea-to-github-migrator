import * as _packageInfo from "./package.json"

import { Octokit } from "@octokit/rest";
const octokitInstance = new Octokit({
	userAgent: `gitea-to-github-migrator ${_packageInfo.version}`
});

namespace settings {
	export let source: string = null;
	export let destinationAccountName: string = null;
	export let destinationRepoName: string = null;
	export let giteaUserName: string = null;
	export let githubUserName: string = null;
}

namespace flagNames {
	export const AUTH_GITEA = "--auth-gitea";
	export const AUTH_GITHUB = "--auth-github";
}

//Extracts the flags and their values from the argument list, returning remaining argument list
function processFlags(args: string[]): string[] {
	const rawArgs: string[] = [];

	//Used to construct a flag before it is pushed to the full array
	let currentFlag: string = null;
	let flagData: string[] = [];
	let fieldsToCapture = 0;

	let wasParseError = false;

	const parseError = (msg: string) => {
		wasParseError = true;
		console.log(msg);
	}

	//Handles a single flag
	const handleFlag = (flag: string, data: string[]) => {
			//TEMP
		console.log(`${flag}: ${data}`);

		switch(flag) {
			case flagNames.AUTH_GITEA:
				settings.giteaUserName = data[0];
				break;
			case flagNames.AUTH_GITHUB:
				settings.githubUserName = data[0];
				break;
			default:
				console.log(`Unrecognized option:`)
				break;
		}
	}

	for(const arg of args) {
		if(fieldsToCapture > 0) {
			flagData.push(arg);
			fieldsToCapture--;
			if(fieldsToCapture > 0)	continue;
		}

		if(currentFlag) {
			handleFlag(currentFlag, flagData);
			currentFlag = null;
			flagData = [];
			continue;
		}

		if(arg.startsWith('-')) {
			currentFlag = arg;
			switch(arg) {
				case flagNames.AUTH_GITEA:
				case flagNames.AUTH_GITHUB:
					fieldsToCapture = 1;
					break;

				default:
					parseError(`Unrecognized option: ${arg}`);
					currentFlag = null;
					fieldsToCapture = 0;
					break;
			}
		}

		rawArgs.push(arg);
	}

	if(fieldsToCapture > 0) parseError(`Too few arguments for ${currentFlag}`);
	else if(currentFlag) handleFlag(currentFlag, flagData);

	if(wasParseError) {
		process.exit(1);
	}

	return rawArgs;
}

function processArgs() {
	const argsAndFlags = process.argv.slice(2);	//Drop node path, script path
	const args = processFlags(argsAndFlags);

	let wasParseError = false;
	const parseError = (msg: string) => {
		console.log(msg);
		wasParseError = true;
	}
	const gitUrlRegex = /^(.*)\/(.*)\/(.*)(\.git)?$/;
	let sourceUrlRegexResults: string[];

	//Source name
	if(args.length >= 1) {
		settings.source = args[0];

		sourceUrlRegexResults = gitUrlRegex.exec(settings.source);
		if(sourceUrlRegexResults.length == 0) {
			parseError("Error: source URL malformed");
		}
	} else parseError("Error: missing source URL");

	//Destination name
	if(args.length >= 2) {
		const argSplit = args[1].split("/");
		
		settings.destinationAccountName = argSplit[0];
		if(argSplit.length == 2 && argSplit[1] != "") settings.destinationRepoName = argSplit[2];
		else if(0 < argSplit.length && argSplit.length <= 2) settings.destinationRepoName = sourceUrlRegexResults[3];
		else parseError("Error: destination argument malformed");
	} else parseError("Error: missing destination");

	console.log(settings);

	if(wasParseError) {
		process.exit(1);
	}
}

async function main() {
	processArgs();
	//TODO: Ensure source repo exists
	//TODO: Login to API(s)
	//TODO: Start migration to GitHub (use GitHub's repo migration feature)
} main();

