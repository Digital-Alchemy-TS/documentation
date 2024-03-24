> [!success]
> You got the [[Automation Quickstart Overview|quickstart]] project pulled down, what now? What's the most important to know to get started?

## The sights
Before diving into the how, I'm going to take a moment to give a tour of the most important parts of the repo
### project root
#### /package.json

| The package.json contains useful workspace commands | [![[npm_scripts.png]]](obsidian://open?vault=documentation&file=Quickstart%2FAutomation%2Fassets%2Fnpm_scripts.png) |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
You can run the commands from the command line if you are comfortable, or by using the buttons provided by VSCode. 

> [!faq]
Don't see the panel? 
> - Make sure the `NPM Scripts` option is checked.
> - Sometimes VSCode may not make the panel visible until you open `package.json`
### scripts/
This folder contains helper scripts for managing your workspace, and is utilized by the various commands in `package.json`. Re-running the setup script will upgrade the provided scripts with the newest version from the [[Automation Quickstart Overview|quickstart]] repo

### addon/
This is your code runner addon, the source is provided in order for you to find the best balance for your 

### src/
#### main.ts

This file contains all the wiring for your application. You can define new configurations, import libraries, and attach your service functions so they run.

No logic goes here directly.