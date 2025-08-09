# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AI Guidance

* After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
* For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
* Before you finish, please verify your solution.
* Do what has been asked; nothing more, nothing less.
* NEVER create files unless they're absolutely necessary for achieving your goal.
* ALWAYS prefer editing an existing file to creating a new one.
* NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
* When asked to commit changes, exclude CLAUDE.md from any commits. Never delete this file.
* For React Hooks, stick to the same pattern as the current hooks located in `/src/hooks`.
* For React components make sure to follow the functional React pattern and include a return clause at the top of the component function.
* Make sure all of your changes are clean of Eslint and TypeScript errors.
* Use `pnpm` over any other package manager.
* Use TailwindCSS for styling and make sure the version you are referencing is compatible with the version in package.json.
* Don't write tests for any files located in `/src/components/ui`.
* Don't write tests to check for styling in components and make sure to check tests for TS errors.
* Limit leaving comments in tests unless the test is really intricate.
* Always use semicolons after statements.

## Project Overview

We are building a audio visualizer app that uses the users microphone to hear what they are playing and display the visualizer in the browser.