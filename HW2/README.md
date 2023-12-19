$ hw --help

  Usage: hw <cmd> [arguments] [options]


  Commands:

    init        Run CLI initialization
    add         Add homework assignment to calendar
    help [cmd]  display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

$ hw add "CS: read chapter 14" "17/12/23 7:00 pm"
  Homework-CLI: Added assignment to calendar!
```

## Installation

Install the CLI:

```
$ npm install -g homework
```

### Setup

Run the init command:

```
$ hw init
```

You'll be prompted to authorize your client with access to your calendar through the browser.

```
$ hw init
  Homework-CLI: Finished initializing the CLI!
```

You may now add homework assignments using the provided commands, as shown below.

## Usage

Run the help command to view the list of commands, varying depending on *homework* version:

```
$ hw -h
```

### Setup Initialization

```
$ hw init
```

Follow the guide above in **Installation: Setup**.

### Add a homework assignment

To add a homework assignment, run the following command:

```
$ hw add "<homework title>" "<due date and time>"
```

This will add a homework item to your calendar. An example is shown below:

```
$ hw add "Math 151 Lab 2" "12/12/23 5:00 pm"
  Homework-CLI: Added assignment to calendar!
```

You may also specify a more detailed description with the -d option, as shown below:

```
$ hw add "<homework title>" "<due date and time>" -d "<detailed description>"